package com.securevault.dto;

import java.time.LocalDateTime;

public class LoginActivityReport {

    private String email;
    private String eventType;
    private String ipAddress;
    private String userAgent;
    private String riskLevel;
    private boolean successful;
    private LocalDateTime timestamp;
    private String description;

    public LoginActivityReport(
            String email,
            String eventType,
            String ipAddress,
            String userAgent,
            String riskLevel,
            boolean successful,
            LocalDateTime timestamp,
            String description) {

        this.email = email;
        this.eventType = eventType;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.riskLevel = riskLevel;
        this.successful = successful;
        this.timestamp = timestamp;
        this.description = description;
    }

    public String getEmail() {
        return email;
    }

    public String getEventType() {
        return eventType;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public boolean isSuccessful() {
        return successful;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public String getDescription() {
        return description;
    }
}