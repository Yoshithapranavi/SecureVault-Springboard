package com.securevault.service;

import com.securevault.entity.PasswordResetToken;
import com.securevault.entity.User;
import com.securevault.repository.PasswordResetTokenRepository;
import com.securevault.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;

@Service
public class PasswordRecoveryService {
        @Value("${app.frontend-url:http://localhost:3000}")
        private String frontendUrl;

        private final UserRepository userRepository;
        private final PasswordResetTokenRepository tokenRepository;
        private final BCryptPasswordEncoder passwordEncoder;
        private final EmailService emailService;
        private final NotificationService notificationService;

        public PasswordRecoveryService(
                        UserRepository userRepository,
                        PasswordResetTokenRepository tokenRepository,
                        BCryptPasswordEncoder passwordEncoder,
                        EmailService emailService,
                        NotificationService notificationService) {

                this.userRepository = userRepository;
                this.tokenRepository = tokenRepository;
                this.passwordEncoder = passwordEncoder;
                this.emailService = emailService;
                this.notificationService = notificationService;
        }

        @Transactional
        public void requestPasswordReset(String email) {

                /*
                 * Always return the same external result
                 * whether the email exists or not.
                 *
                 * This prevents account enumeration.
                 */

                User user = userRepository.findByEmail(email)
                                .orElse(null);

                if (user == null) {
                        return;
                }

                tokenRepository.deleteByUser(user);

                String token = UUID.randomUUID().toString();

                PasswordResetToken resetToken = new PasswordResetToken();

                resetToken.setToken(token);
                resetToken.setUser(user);
                resetToken.setExpiresAt(
                                LocalDateTime.now().plusMinutes(15));
                resetToken.setUsed(false);

                tokenRepository.save(resetToken);

                String resetLink = frontendUrl + "/reset-password?token=" + token;

                emailService.sendPasswordResetEmail(
                                user.getEmail(),
                                resetLink);

                notificationService.createNotification(
                                user,
                                "Password Reset Requested",
                                "A password reset link was sent to your email.",
                                "UNREAD");
        }

        @Transactional
        public void resetPassword(
                        String token,
                        String newPassword) {

                PasswordResetToken resetToken = tokenRepository.findByTokenAndUsedFalse(token)
                                .orElseThrow(() -> new IllegalArgumentException(
                                                "Invalid password reset token."));

                if (resetToken.isUsed()) {
                        throw new IllegalArgumentException(
                                        "Password reset token has already been used.");
                }

                if (resetToken.getExpiresAt()
                                .isBefore(LocalDateTime.now())) {

                        throw new IllegalArgumentException(
                                        "Password reset token has expired.");
                }

                User user = resetToken.getUser();

                user.setPasswordHash(
                                passwordEncoder.encode(newPassword));

                user.setUpdatedAt(
                                LocalDateTime.now());

                userRepository.save(user);

                resetToken.setUsed(true);

                tokenRepository.save(resetToken);

                notificationService.createNotification(
                                user,
                                "Password Changed",
                                "Your SecureVault password was changed successfully.",
                                "UNREAD");
        }
}