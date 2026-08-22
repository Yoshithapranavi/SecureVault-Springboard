import api from "./api";


// =========================================================
// SECURITY SUMMARY
// =========================================================

export const getSecuritySummary = async () => {
    const response = await api.get(
        "/security/reports/security-summary"
    );

    return response.data;
};


// =========================================================
// AUDIT LOGS
// =========================================================

export const getAuditLogs = async () => {
    const response = await api.get(
        "/audit"
    );

    return response.data;
};


// =========================================================
// ADMIN USERS
// =========================================================

export const getAllUsers = async () => {
    const response = await api.get(
        "/admin/users"
    );

    return response.data;
};

// =========================================================
// SECURITY ALERTS
// =========================================================

export const getSecurityAlerts = async () => {

    const response = await api.get(
        "/security/reports/alerts"
    );

    return response.data;
};


// =========================================================
// RESOLVE SECURITY ALERT
// =========================================================

export const resolveSecurityAlert = async (
    alertId
) => {

    const response = await api.put(
        `/security/reports/alerts/${alertId}/resolve`
    );

    return response.data;
};
// =========================================================
// LOGIN ACTIVITY
// =========================================================

export const getLoginActivity = async (
    email
) => {

    const response = await api.get(
        `/security/reports/login-activity/${encodeURIComponent(email)}`
    );

    return response.data;
};

// =========================================================
// USER DASHBOARD
// =========================================================

export const getDashboard = async () => {

    const response = await api.get(
        "/security/reports/dashboard"
    );

    return response.data;
};

// =========================================================
// DOWNLOAD SECURITY REPORT PDF
// =========================================================

export const downloadSecurityReportPdf = async () => {

    const token =
        localStorage.getItem("securevault_token");

    const response = await api.get(
        "/security/reports/security-report/pdf",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
        }
    );

    return response.data;
};

// =========================================================
// DOWNLOAD SECURITY REPORT EXCEL
// =========================================================

export const downloadSecurityReportExcel = async () => {

    const token =
        localStorage.getItem("securevault_token");

    const response = await api.get(
        "/security/reports/security-report/excel",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
        }
    );

    return response.data;
};

// =========================================================
// DOWNLOAD AUDIT REPORT PDF
// =========================================================

export const downloadAuditReportPdf = async () => {

    const response = await api.get(
        "/audit/report/pdf",
        {
            responseType: "blob",
        }
    );

    return response.data;
};


// =========================================================
// DOWNLOAD AUDIT REPORT EXCEL
// =========================================================

export const downloadAuditReportExcel = async () => {

    const response = await api.get(
        "/audit/report/excel",
        {
            responseType: "blob",
        }
    );

    return response.data;
};