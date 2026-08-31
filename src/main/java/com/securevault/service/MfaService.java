package com.securevault.service;

import com.securevault.entity.MfaOtp;
import com.securevault.entity.User;
import com.securevault.repository.MfaOtpRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class MfaService {

        private static final int OTP_EXPIRATION_MINUTES = 5;
        private static final int MAX_ATTEMPTS = 5;

        private final MfaOtpRepository mfaOtpRepository;
        private final BCryptPasswordEncoder passwordEncoder;
        private final EmailService emailService;
        private final SecureRandom secureRandom;

        public MfaService(
                        MfaOtpRepository mfaOtpRepository,
                        BCryptPasswordEncoder passwordEncoder,
                        EmailService emailService) {

                this.mfaOtpRepository = mfaOtpRepository;
                this.passwordEncoder = passwordEncoder;
                this.emailService = emailService;
                this.secureRandom = new SecureRandom();
        }

        // =========================================================
        // GENERATE OTP
        // =========================================================

        public String generateOtp(User user) {

                String otp = String.format(
                                "%06d",
                                secureRandom.nextInt(1_000_000));

                MfaOtp mfaOtp = new MfaOtp();

                mfaOtp.setUser(user);

                // Hash OTP before storing it
                mfaOtp.setOtpHash(
                                passwordEncoder.encode(otp));

                // OTP expires after 5 minutes
                mfaOtp.setExpiresAt(
                                LocalDateTime.now()
                                                .plusMinutes(OTP_EXPIRATION_MINUTES));

                mfaOtp.setVerified(false);
                mfaOtp.setAttempts(0);

                mfaOtp.setCreatedAt(
                                LocalDateTime.now());

                // Store hashed OTP in database
                mfaOtpRepository.save(mfaOtp);

                return otp;
        }

        // =========================================================
        // SEND OTP EMAIL
        // =========================================================

        public void sendOtpEmail(
                        String email,
                        String otp) {

                String subject = "SecureVault MFA Verification Code";

                String text = "Your SecureVault verification code is: "
                                + otp
                                + "\n\n"
                                + "This OTP is valid for 5 minutes."
                                + "\n"
                                + "Do not share this code with anyone.";

                // Send through Brevo HTTPS API
                emailService.sendEmail(
                                email,
                                subject,
                                text);
        }

        // =========================================================
        // VERIFY OTP
        // =========================================================

        public boolean verifyOtp(
                        User user,
                        String otp) {

                MfaOtp mfaOtp = mfaOtpRepository
                                .findTopByUserAndVerifiedFalseOrderByCreatedAtDesc(
                                                user)
                                .orElse(null);

                // OTP not found
                if (mfaOtp == null) {
                        return false;
                }

                // OTP expired
                if (mfaOtp.getExpiresAt()
                                .isBefore(LocalDateTime.now())) {

                        return false;
                }

                // Maximum attempts reached
                if (mfaOtp.getAttempts() >= MAX_ATTEMPTS) {
                        return false;
                }

                // Increment attempt count
                mfaOtp.setAttempts(
                                mfaOtp.getAttempts() + 1);

                // Compare entered OTP with stored hash
                boolean valid = passwordEncoder.matches(
                                otp,
                                mfaOtp.getOtpHash());

                // Mark OTP as verified
                if (valid) {
                        mfaOtp.setVerified(true);
                }

                // Save updated OTP
                mfaOtpRepository.save(mfaOtp);

                return valid;
        }
}