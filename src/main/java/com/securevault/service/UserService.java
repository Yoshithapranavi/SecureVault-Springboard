package com.securevault.service;

import com.securevault.dto.LoginRequest;
import com.securevault.dto.LoginResponse;
import com.securevault.dto.RegisterRequest;

import com.securevault.entity.User;
import com.securevault.entity.SecurityAlert;
import com.securevault.entity.SecurityEvent;
import com.securevault.entity.AuditLog;

import com.securevault.enums.Role;
import com.securevault.enums.RiskLevel;
import com.securevault.enums.SecurityEventType;

import com.securevault.exception.DuplicateEmailException;
import com.securevault.exception.InvalidCredentialsException;

import com.securevault.repository.UserRepository;
import com.securevault.repository.SecurityAlertRepository;
import com.securevault.repository.SecurityEventRepository;
import com.securevault.repository.AuditLogRepository;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

import com.securevault.dto.AdminUserResponse;

import java.util.List;
import com.securevault.service.JwtService;
import com.securevault.service.RevokedTokenService;

@Service
public class UserService {

        private static final Logger logger = LoggerFactory.getLogger(UserService.class);

        private final UserRepository userRepository;
        private final BCryptPasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final SecurityEventRepository securityEventRepository;
        private final SecurityAlertRepository securityAlertRepository;
        private final AuditLogRepository auditLogRepository;
        private final MfaService mfaService;
        private final DeviceService deviceService;

        private final RevokedTokenService revokedTokenService;

        public UserService(
                        UserRepository userRepository,
                        BCryptPasswordEncoder passwordEncoder,
                        JwtService jwtService,
                        SecurityEventRepository securityEventRepository,
                        SecurityAlertRepository securityAlertRepository,
                        AuditLogRepository auditLogRepository,
                        MfaService mfaService, DeviceService deviceService,
                        RevokedTokenService revokedTokenService) {

                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
                this.securityEventRepository = securityEventRepository;
                this.securityAlertRepository = securityAlertRepository;
                this.auditLogRepository = auditLogRepository;
                this.mfaService = mfaService;
                this.deviceService = deviceService;
                this.revokedTokenService = revokedTokenService;
        }

        // =========================================================
        // USER REGISTRATION
        // =========================================================

        public String registerUser(RegisterRequest request) {

                logger.info(
                                "Registration request received for email: {}",
                                request.getEmail());

                Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

                if (existingUser.isPresent()) {

                        logger.warn(
                                        "Registration failed. Email already exists: {}",
                                        request.getEmail());

                        throw new DuplicateEmailException(
                                        "Email is already registered.");
                }

                User user = new User();

                user.setName(request.getName());
                user.setEmail(request.getEmail());

                user.setPasswordHash(
                                passwordEncoder.encode(
                                                request.getPassword()));

                user.setRole(Role.USER);
                user.setCreatedAt(LocalDateTime.now());
                user.setUpdatedAt(LocalDateTime.now());

                userRepository.save(user);

                logger.info(
                                "User registered successfully. User ID: {}, Email: {}",
                                user.getId(),
                                user.getEmail());

                return "User registered successfully.";
        }

        // =========================================================
        // LOGIN
        // =========================================================

        public LoginResponse loginUser(
                        LoginRequest request,
                        HttpServletRequest httpRequest) {

                String email = request.getEmail();

                String ipAddress = httpRequest.getRemoteAddr();

                String userAgent = httpRequest.getHeader("User-Agent");

                LocalDateTime now = LocalDateTime.now();

                logger.info(
                                "Login attempt for email: {}",
                                email);

                Optional<User> existingUser = userRepository.findByEmail(email);

                // -----------------------------------------------------
                // USER NOT FOUND
                // -----------------------------------------------------

                if (existingUser.isEmpty()) {

                        logger.warn(
                                        "Login failed. User not found for email: {}",
                                        email);

                        recordSecurityEvent(
                                        email,
                                        null,
                                        SecurityEventType.LOGIN_FAILURE,
                                        ipAddress,
                                        userAgent,
                                        RiskLevel.MEDIUM,
                                        false,
                                        "Login failed because the user was not found.");

                        throw new InvalidCredentialsException(
                                        "Invalid email or password.");
                }

                User user = existingUser.get();

                // -----------------------------------------------------
                // PASSWORD CHECK
                // -----------------------------------------------------

                boolean match = passwordEncoder.matches(
                                request.getPassword(),
                                user.getPasswordHash());

                if (!match) {

                        logger.warn(
                                        "Login failed. Invalid password for email: {}",
                                        email);

                        LocalDateTime failureWindow = now.minusMinutes(15);

                        long recentFailures = securityEventRepository
                                        .countByEmailAndEventTypeAndSuccessfulFalseAndTimestampAfter(
                                                        email,
                                                        SecurityEventType.LOGIN_FAILURE,
                                                        failureWindow);

                        recentFailures++;

                        RiskLevel riskLevel;

                        if (recentFailures >= 5) {

                                riskLevel = RiskLevel.HIGH;

                        } else if (recentFailures >= 3) {

                                riskLevel = RiskLevel.MEDIUM;

                        } else {

                                riskLevel = RiskLevel.LOW;
                        }

                        recordSecurityEvent(
                                        email,
                                        user.getId(),
                                        SecurityEventType.LOGIN_FAILURE,
                                        ipAddress,
                                        userAgent,
                                        riskLevel,
                                        false,
                                        "Invalid password during login attempt.");

                        if (recentFailures >= 3) {

                                createSecurityAlert(
                                                email,
                                                user.getId(),
                                                "REPEATED_LOGIN_FAILURE",
                                                riskLevel,
                                                "Multiple failed login attempts detected within 15 minutes.");
                        }

                        throw new InvalidCredentialsException(
                                        "Invalid email or password.");
                }
                deviceService.recordLoginDevice(
                                user,
                                ipAddress,
                                userAgent);

                // -----------------------------------------------------
                // PASSWORD CORRECT
                // MFA REQUIRED
                // -----------------------------------------------------

                String otp = mfaService.generateOtp(user);

                logger.info(
                                "MFA OTP generated for user: {}",
                                email);

                mfaService.sendOtpEmail(
                                user.getEmail(),
                                otp);

                logger.info(
                                "MFA OTP sent to email: {}",
                                email);

                /*
                 * JWT IS NOT GENERATED HERE.
                 *
                 * The user must verify the OTP first.
                 */

                return new LoginResponse(
                                true,
                                user.getEmail());
        }

        // =========================================================
        // MFA VERIFICATION
        // =========================================================

        public LoginResponse verifyMfa(
                        String email,
                        String otp,
                        HttpServletRequest httpRequest) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new InvalidCredentialsException(
                                                "User not found."));
                logger.info(
                                "MFA user loaded: id={}, email={}, role={}",
                                user.getId(),
                                user.getEmail(),
                                user.getRole());

                boolean valid = mfaService.verifyOtp(
                                user,
                                otp);

                if (!valid) {

                        logger.warn(
                                        "MFA verification failed for email: {}",
                                        email);

                        throw new InvalidCredentialsException(
                                        "Invalid or expired OTP.");
                }

                String ipAddress = httpRequest.getRemoteAddr();

                String userAgent = httpRequest.getHeader("User-Agent");

                // -----------------------------------------------------
                // NEW DEVICE DETECTION
                // -----------------------------------------------------

                boolean knownDevice = securityEventRepository
                                .existsByEmailAndEventTypeAndUserAgentAndSuccessfulTrue(
                                                email,
                                                SecurityEventType.LOGIN_SUCCESS,
                                                userAgent);

                if (!knownDevice) {

                        logger.warn(
                                        "New device detected for user: {}",
                                        email);

                        recordSecurityEvent(
                                        email,
                                        user.getId(),
                                        SecurityEventType.NEW_DEVICE,
                                        ipAddress,
                                        userAgent,
                                        RiskLevel.MEDIUM,
                                        true,
                                        "Login detected from a new device.");

                        createSecurityAlert(
                                        email,
                                        user.getId(),
                                        "NEW_DEVICE_LOGIN",
                                        RiskLevel.MEDIUM,
                                        "A login was detected from a new device.");
                }

                // -----------------------------------------------------
                // SUCCESSFUL LOGIN EVENT
                // -----------------------------------------------------

                recordSecurityEvent(
                                email,
                                user.getId(),
                                SecurityEventType.LOGIN_SUCCESS,
                                ipAddress,
                                userAgent,
                                knownDevice
                                                ? RiskLevel.LOW
                                                : RiskLevel.MEDIUM,
                                true,
                                knownDevice
                                                ? "Successful login from a known device."
                                                : "Successful login from a new device.");

                // -----------------------------------------------------
                // JWT
                // -----------------------------------------------------

                logger.info(
                                "Generating JWT: email={}, role={}",
                                user.getEmail(),
                                user.getRole());

                String token = jwtService.generateToken(
                                user.getEmail(),
                                user.getRole());
                // -----------------------------------------------------
                // LOGIN AUDIT
                // -----------------------------------------------------

                AuditLog auditLog = new AuditLog();

                auditLog.setAction("LOGIN");
                auditLog.setEntityType("User");
                auditLog.setEntityId(user.getId());
                auditLog.setPerformedBy(user.getEmail());
                auditLog.setTimestamp(
                                LocalDateTime.now());

                auditLogRepository.save(
                                auditLog);

                logger.info(
                                "Login successful after MFA. User ID: {}, Email: {}",
                                user.getId(),
                                user.getEmail());

                return new LoginResponse(token);
        }

        // =========================================================
        // SECURITY EVENT
        // =========================================================

        private void recordSecurityEvent(
                        String email,
                        Long userId,
                        SecurityEventType eventType,
                        String ipAddress,
                        String userAgent,
                        RiskLevel riskLevel,
                        boolean successful,
                        String description) {

                SecurityEvent event = new SecurityEvent();

                event.setEmail(email);
                event.setUserId(userId);
                event.setEventType(eventType);
                event.setIpAddress(ipAddress);
                event.setUserAgent(userAgent);
                event.setRiskLevel(riskLevel);
                event.setSuccessful(successful);
                event.setTimestamp(
                                LocalDateTime.now());
                event.setDescription(description);

                securityEventRepository.save(event);
        }

        // =========================================================
        // SECURITY ALERT
        // =========================================================

        private void createSecurityAlert(
                        String email,
                        Long userId,
                        String alertType,
                        RiskLevel riskLevel,
                        String message) {

                SecurityAlert alert = new SecurityAlert();

                alert.setEmail(email);
                alert.setUserId(userId);
                alert.setAlertType(alertType);
                alert.setRiskLevel(riskLevel);
                alert.setMessage(message);
                alert.setTimestamp(
                                LocalDateTime.now());
                alert.setResolved(false);

                securityAlertRepository.save(
                                alert);

                logger.warn(
                                "SECURITY ALERT: Type={}, Email={}, Risk={}",
                                alertType,
                                email,
                                riskLevel);
        }

        // =========================================================
        // LOGOUT
        // =========================================================

        public void logout(
                        String email,
                        String token) {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new InvalidCredentialsException(
                                                "User not found."));

                LocalDateTime expiresAt = jwtService.extractExpiration(token)
                                .toInstant()
                                .atZone(java.time.ZoneId.systemDefault())
                                .toLocalDateTime();

                revokedTokenService.revokeToken(
                                token,
                                expiresAt);

                AuditLog auditLog = new AuditLog();

                auditLog.setAction("LOGOUT");
                auditLog.setEntityType("User");
                auditLog.setEntityId(user.getId());
                auditLog.setPerformedBy(user.getEmail());
                auditLog.setTimestamp(LocalDateTime.now());

                auditLogRepository.save(auditLog);

                logger.info(
                                "Logout recorded and JWT revoked. User ID={}, Email={}",
                                user.getId(),
                                user.getEmail());
        }

        public User getCurrentUser(String email) {

                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found."));
        }

        // =========================================================
        // ADMIN - GET ALL USERS
        // =========================================================

        public List<AdminUserResponse> getAllUsers() {

                return userRepository
                                .findAll()
                                .stream()
                                .map(user -> new AdminUserResponse(
                                                user.getId(),
                                                user.getName(),
                                                user.getEmail(),
                                                user.getRole(),
                                                user.getCreatedAt()))
                                .toList();
        }
}