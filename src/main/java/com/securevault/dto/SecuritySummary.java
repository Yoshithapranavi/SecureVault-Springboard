package com.securevault.dto;

public class SecuritySummary {

    private long totalSecurityEvents;
    private long successfulLogins;
    private long failedLogins;
    private long highRiskEvents;
    private long mediumRiskEvents;
    private long lowRiskEvents;
    private long unresolvedAlerts;

    public SecuritySummary(
            long totalSecurityEvents,
            long successfulLogins,
            long failedLogins,
            long highRiskEvents,
            long mediumRiskEvents,
            long lowRiskEvents,
            long unresolvedAlerts) {

        this.totalSecurityEvents = totalSecurityEvents;
        this.successfulLogins = successfulLogins;
        this.failedLogins = failedLogins;
        this.highRiskEvents = highRiskEvents;
        this.mediumRiskEvents = mediumRiskEvents;
        this.lowRiskEvents = lowRiskEvents;
        this.unresolvedAlerts = unresolvedAlerts;
    }

    public long getTotalSecurityEvents() {
        return totalSecurityEvents;
    }

    public long getSuccessfulLogins() {
        return successfulLogins;
    }

    public long getFailedLogins() {
        return failedLogins;
    }

    public long getHighRiskEvents() {
        return highRiskEvents;
    }

    public long getMediumRiskEvents() {
        return mediumRiskEvents;
    }

    public long getLowRiskEvents() {
        return lowRiskEvents;
    }

    public long getUnresolvedAlerts() {
        return unresolvedAlerts;
    }
}