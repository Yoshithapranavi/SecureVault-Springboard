package com.securevault.service;

import com.securevault.entity.MfaOtp;
import com.securevault.entity.User;
import com.securevault.repository.MfaOtpRepository;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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
        private final JavaMailSender mailSender;
        private final SecureRandom secureRandom;

        public MfaService(
                        MfaOtpRepository mfaOtpRepository,
                        BCryptPasswordEncoder passwordEncoder,
                        JavaMailSender mailSender) {

                this.mfaOtpRepository = mfaOtpRepository;
                this.passwordEncoder = passwordEncoder;
                this.mailSender = mailSender;
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

                mfaOtp.setOtpHash(
                                passwordEncoder.encode(otp));

                mfaOtp.setExpiresAt(
                                LocalDateTime.now()
                                                .plusMinutes(OTP_EXPIRATION_MINUTES));

                mfaOtp.setVerified(false);
                mfaOtp.setAttempts(0);

                mfaOtp.setCreatedAt(
                                LocalDateTime.now());

                mfaOtpRepository.save(mfaOtp);

                return otp;
        }

        // =========================================================
        // SEND OTP EMAIL
        // =========================================================

        public void sendOtpEmail(
                        String email,
                        String otp) {

                SimpleMailMessage message = new SimpleMailMessage();

                message.setTo(email);

                message.setSubject(
                                "SecureVault MFA Verification Code");

                message.setText(
                                "Your SecureVault verification code is: "
                                                + otp
                                                + "\n\n"
                                                + "This OTP is valid for 5 minutes."
                                                + "\n"
                                                + "Do not share this code with anyone.");

                mailSender.send(message);
        }

        // =========================================================
        // VERIFY OTP
        // =========================================================

        public boolean verifyOtp(
                        User user,
                        String otp) {

                MfaOtp mfaOtp = mfaOtpRepository
                                .findTopByUserAndVerifiedFalseOrderByCreatedAtDesc(user)
                                .orElse(null);

                if (mfaOtp == null) {
                        return false;
                }

                if (mfaOtp.getExpiresAt()
                                .isBefore(LocalDateTime.now())) {

                        return false;
                }

                if (mfaOtp.getAttempts() >= MAX_ATTEMPTS) {
                        return false;
                }

                mfaOtp.setAttempts(
                                mfaOtp.getAttempts() + 1);

                boolean valid = passwordEncoder.matches(
                                otp,
                                mfaOtp.getOtpHash());

                if (valid) {
                        mfaOtp.setVerified(true);
                }

                mfaOtpRepository.save(mfaOtp);

                return valid;
        }
}