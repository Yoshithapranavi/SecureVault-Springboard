package com.securevault.service;

import com.securevault.dto.LoginActivityReport;
import com.securevault.dto.PasswordHealthReport;
import com.securevault.dto.SecurityReportResponse;
import com.securevault.entity.SecurityEvent;
import com.securevault.repository.SecurityAlertRepository;
import com.securevault.repository.SecurityEventRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import com.securevault.dto.SecuritySummary;
import com.securevault.enums.RiskLevel;

import com.securevault.dto.DashboardResponse;
import com.securevault.entity.AuditLog;
import com.securevault.entity.SecurityAlert;
import com.securevault.repository.AuditLogRepository;
import com.securevault.repository.CredentialRepository;
import com.securevault.repository.CredentialShareRepository;
import com.securevault.entity.User;
import com.securevault.repository.UserRepository;

@Service
public class SecurityReportService {

        private final SecurityEventRepository securityEventRepository;
        private final SecurityAlertRepository securityAlertRepository;
        private final CredentialRepository credentialRepository;
        private final CredentialShareRepository credentialShareRepository;
        private final AuditLogRepository auditLogRepository;
        private final CredentialService credentialService;
        private final UserRepository userRepository;

        public SecurityReportService(
                        SecurityEventRepository securityEventRepository,
                        SecurityAlertRepository securityAlertRepository,
                        CredentialRepository credentialRepository,
                        CredentialShareRepository credentialShareRepository,
                        AuditLogRepository auditLogRepository,
                        CredentialService credentialService,
                        UserRepository userRepository) {

                this.securityEventRepository = securityEventRepository;

                this.securityAlertRepository = securityAlertRepository;

                this.credentialRepository = credentialRepository;

                this.credentialShareRepository = credentialShareRepository;

                this.auditLogRepository = auditLogRepository;

                this.credentialService = credentialService;

                this.userRepository = userRepository;
        }

        public List<LoginActivityReport> getLoginActivity(String email) {

                List<SecurityEvent> events = securityEventRepository
                                .findByEmailOrderByTimestampDesc(email);

                return events.stream()
                                .map(event -> new LoginActivityReport(
                                                event.getEmail(),
                                                event.getEventType().name(),
                                                event.getIpAddress(),
                                                event.getUserAgent(),
                                                event.getRiskLevel().name(),
                                                event.isSuccessful(),
                                                event.getTimestamp(),
                                                event.getDescription()))
                                .toList();
        }

        public SecuritySummary getSecuritySummary() {

                long totalSecurityEvents = securityEventRepository.count();

                long successfulLogins = securityEventRepository.countBySuccessfulTrue();

                long failedLogins = securityEventRepository.countBySuccessfulFalse();

                long highRiskEvents = securityEventRepository.countByRiskLevel(RiskLevel.HIGH);

                long mediumRiskEvents = securityEventRepository.countByRiskLevel(RiskLevel.MEDIUM);

                long lowRiskEvents = securityEventRepository.countByRiskLevel(RiskLevel.LOW);

                long unresolvedAlerts = securityAlertRepository.countByResolvedFalse();

                return new SecuritySummary(
                                totalSecurityEvents,
                                successfulLogins,
                                failedLogins,
                                highRiskEvents,
                                mediumRiskEvents,
                                lowRiskEvents,
                                unresolvedAlerts);
        }

        public DashboardResponse getDashboard(
                        String authenticatedEmail) {

                // =========================================================
                // GET AUTHENTICATED USER
                // =========================================================

                User user = userRepository
                                .findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new RuntimeException(
                                                "Authenticated user not found."));

                Long userId = user.getId();

                // =========================================================
                // USER CREDENTIALS
                // =========================================================

                long totalCredentials = credentialRepository
                                .countByUserIdAndDeletedFalse(
                                                userId);

                // =========================================================
                // CREDENTIALS SHARED BY USER
                // =========================================================

                long sharedCredentials = credentialShareRepository
                                .countByOwner_IdAndActiveTrue(
                                                userId);

                // =========================================================
                // WEAK PASSWORDS
                // =========================================================

                long weakPasswordCount = getWeakPasswordCount(authenticatedEmail);

                // =========================================================
                // FAILED LOGIN ATTEMPTS
                // USER SPECIFIC
                // =========================================================

                long failedLoginCount = securityEventRepository
                                .countByEmailAndSuccessfulFalse(
                                                authenticatedEmail);

                // =========================================================
                // SECURITY ALERTS
                // USER SPECIFIC
                // =========================================================

                List<SecurityAlert> recentSecurityAlerts = securityAlertRepository
                                .findTop5ByUserIdOrderByTimestampDesc(
                                                userId);

                // =========================================================
                // USER ACTIVITY
                // =========================================================

                List<AuditLog> recentUserActivity = auditLogRepository
                                .findTop5ByPerformedByOrderByTimestampDesc(
                                                authenticatedEmail);

                // =========================================================
                // RESPONSE
                // =========================================================

                return new DashboardResponse(
                                totalCredentials,
                                sharedCredentials,
                                weakPasswordCount,
                                failedLoginCount,
                                recentSecurityAlerts,
                                recentUserActivity);
        }

        private long getWeakPasswordCount(
                        String authenticatedEmail) {

                PasswordHealthReport report = credentialService.getPasswordHealthReport(
                                authenticatedEmail);

                return report.getWeakPasswords();
        }

        // =========================================================
        // ADMIN - GET ALL SECURITY ALERTS
        // =========================================================

        public List<SecurityAlert> getAllSecurityAlerts() {

                return securityAlertRepository
                                .findAllByOrderByTimestampDesc();
        }

        // =========================================================
        // ADMIN - GET UNRESOLVED SECURITY ALERTS
        // =========================================================

        public List<SecurityAlert> getUnresolvedSecurityAlerts() {

                return securityAlertRepository
                                .findByResolvedFalseOrderByTimestampDesc();
        }

        // =========================================================
        // ADMIN - RESOLVE SECURITY ALERT
        // =========================================================

        public String resolveSecurityAlert(Long alertId) {

                SecurityAlert alert = securityAlertRepository
                                .findById(alertId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Security alert not found."));

                if (alert.isResolved()) {

                        return "Security alert is already resolved.";
                }

                alert.setResolved(true);

                securityAlertRepository.save(alert);

                return "Security alert resolved successfully.";
        }

        // =========================================================
        // SECURITY REPORT
        // ADMIN ONLY
        // =========================================================

        public SecurityReportResponse getSecurityReport() {

                SecuritySummary summary = getSecuritySummary();

                List<SecurityEvent> events = securityEventRepository
                                .findAll()
                                .stream()
                                .sorted((a, b) -> b.getTimestamp()
                                                .compareTo(
                                                                a.getTimestamp()))
                                .toList();

                List<LoginActivityReport> loginActivity = events.stream()
                                .map(event -> new LoginActivityReport(
                                                event.getEmail(),
                                                event.getEventType().name(),
                                                event.getIpAddress(),
                                                event.getUserAgent(),
                                                event.getRiskLevel().name(),
                                                event.isSuccessful(),
                                                event.getTimestamp(),
                                                event.getDescription()))
                                .toList();

                List<SecurityAlert> alerts = securityAlertRepository
                                .findAllByOrderByTimestampDesc();

                return new SecurityReportResponse(
                                summary,
                                loginActivity,
                                alerts);
        }
}