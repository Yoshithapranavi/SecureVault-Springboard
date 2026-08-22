package com.securevault.dto;

import com.securevault.entity.SecurityAlert;

import java.util.List;

public class SecurityReportResponse {

    private SecuritySummary summary;

    private List<LoginActivityReport> loginActivity;

    private List<SecurityAlert> alerts;

    public SecurityReportResponse(
            SecuritySummary summary,
            List<LoginActivityReport> loginActivity,
            List<SecurityAlert> alerts) {

        this.summary = summary;
        this.loginActivity = loginActivity;
        this.alerts = alerts;
    }

    public SecuritySummary getSummary() {
        return summary;
    }

    public List<LoginActivityReport> getLoginActivity() {
        return loginActivity;
    }

    public List<SecurityAlert> getAlerts() {
        return alerts;
    }
}