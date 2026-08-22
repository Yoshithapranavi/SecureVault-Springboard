package com.securevault.dto;

import com.securevault.entity.AuditLog;
import com.securevault.entity.SecurityAlert;

import java.util.List;

public class DashboardResponse {

    private long totalCredentials;
    private long sharedCredentials;
    private long weakPasswordCount;
    private long failedLoginCount;

    private List<SecurityAlert> recentSecurityAlerts;
    private List<AuditLog> recentUserActivity;

    public DashboardResponse(
            long totalCredentials,
            long sharedCredentials,
            long weakPasswordCount,
            long failedLoginCount,
            List<SecurityAlert> recentSecurityAlerts,
            List<AuditLog> recentUserActivity) {

        this.totalCredentials = totalCredentials;
        this.sharedCredentials = sharedCredentials;
        this.weakPasswordCount = weakPasswordCount;
        this.failedLoginCount = failedLoginCount;
        this.recentSecurityAlerts = recentSecurityAlerts;
        this.recentUserActivity = recentUserActivity;
    }

    public long getTotalCredentials() {
        return totalCredentials;
    }

    public long getSharedCredentials() {
        return sharedCredentials;
    }

    public long getWeakPasswordCount() {
        return weakPasswordCount;
    }

    public long getFailedLoginCount() {
        return failedLoginCount;
    }

    public List<SecurityAlert> getRecentSecurityAlerts() {
        return recentSecurityAlerts;
    }

    public List<AuditLog> getRecentUserActivity() {
        return recentUserActivity;
    }
}