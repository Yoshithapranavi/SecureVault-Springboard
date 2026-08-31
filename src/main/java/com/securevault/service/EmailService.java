package com.securevault.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    @Value("${brevo.sender.name}")
    private String senderName;

    private final RestTemplate restTemplate;

    public EmailService() {
        this.restTemplate = new RestTemplate();
    }

    // =========================================================
    // PASSWORD RESET EMAIL
    // =========================================================

    public void sendPasswordResetEmail(
            String email,
            String resetLink) {

        String subject = "SecureVault Password Reset";

        String text = "Hello,\n\n" +
                "A password reset was requested for your SecureVault account.\n\n" +
                "Use the following link to reset your password:\n\n" +
                resetLink +
                "\n\n" +
                "This link expires in 15 minutes.\n\n" +
                "If you did not request this, you can safely ignore this email.\n\n" +
                "SecureVault";

        sendEmail(
                email,
                subject,
                text);
    }

    // =========================================================
    // GENERIC EMAIL SENDER
    // =========================================================

    public void sendEmail(
            String email,
            String subject,
            String text) {

        String url = "https://api.brevo.com/v3/smtp/email";

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(
                MediaType.APPLICATION_JSON);

        headers.set(
                "api-key",
                brevoApiKey);

        headers.setAccept(
                List.of(MediaType.APPLICATION_JSON));

        // -----------------------------------------------------
        // SENDER
        // -----------------------------------------------------

        Map<String, Object> sender = new HashMap<>();

        sender.put(
                "name",
                senderName);

        sender.put(
                "email",
                senderEmail);

        // -----------------------------------------------------
        // RECIPIENT
        // -----------------------------------------------------

        Map<String, Object> recipient = new HashMap<>();

        recipient.put(
                "email",
                email);

        // -----------------------------------------------------
        // REQUEST BODY
        // -----------------------------------------------------

        Map<String, Object> body = new HashMap<>();

        body.put(
                "sender",
                sender);

        body.put(
                "to",
                List.of(recipient));

        body.put(
                "subject",
                subject);

        body.put(
                "textContent",
                text);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(
                body,
                headers);

        // -----------------------------------------------------
        // SEND THROUGH BREVO HTTPS API
        // -----------------------------------------------------

        ResponseEntity<String> response = restTemplate.postForEntity(
                url,
                request,
                String.class);

        // -----------------------------------------------------
        // CHECK RESPONSE
        // -----------------------------------------------------

        if (!response
                .getStatusCode()
                .is2xxSuccessful()) {

            throw new RuntimeException(
                    "Brevo email request failed: "
                            + response.getStatusCode()
                            + " "
                            + response.getBody());
        }
    }
}