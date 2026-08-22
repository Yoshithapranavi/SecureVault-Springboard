package com.securevault.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(
            String email,
            String resetLink) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);

        message.setSubject(
                "SecureVault Password Reset");

        message.setText(
                "Hello,\n\n" +
                        "A password reset was requested for your SecureVault account.\n\n" +
                        "Use the following link to reset your password:\n\n" +
                        resetLink +
                        "\n\n" +
                        "This link expires in 15 minutes.\n\n" +
                        "If you did not request this, you can safely ignore this email.\n\n" +
                        "SecureVault");

        mailSender.send(message);
    }
}