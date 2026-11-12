import { useEffect, useState } from "react";

import {
    getSecuritySummary,
    downloadSecurityReportPdf,
    downloadSecurityReportExcel,
} from "../services/adminService";
import Icon from "./Icon";

function SecurityOverview({ isAdmin }) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [downloadingExcel, setDownloadingExcel] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }

        loadSummary();
        // The summary is loaded once for the current administrator.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin]);

    const loadSummary = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response = await getSecuritySummary();

            setSummary(response || {});
        } catch (err) {
            console.error("Security summary error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load security summary.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const downloadBlob = (blob, type, filename) => {
        const url = window.URL.createObjectURL(new Blob([blob], { type }));
        const link = document.createElement("a");

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleDownloadPdf = async () => {
        try {
            setDownloadingPdf(true);
            setError("");

            const pdfBlob = await downloadSecurityReportPdf();

            downloadBlob(pdfBlob, "application/pdf", "securevault-security-report.pdf");
        } catch (err) {
            console.error("Security report PDF error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to download security report.",
            );
        } finally {
            setDownloadingPdf(false);
        }
    };

    const handleDownloadExcel = async () => {
        try {
            setDownloadingExcel(true);
            setError("");

            const excelBlob = await downloadSecurityReportExcel();

            downloadBlob(
                excelBlob,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "securevault-security-report.xlsx",
            );
        } catch (err) {
            console.error("Security report Excel error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to download security report.",
            );
        } finally {
            setDownloadingExcel(false);
        }
    };

    if (!isAdmin) {
        return (
            <section className="sv-security-page">
                <div className="sv-empty-state large">
                    <span className="sv-empty-icon" aria-hidden="true">
                        <Icon name="lock" size={22} />
                    </span>
                    <div>
                        <h2>Administrator access required</h2>
                        <p>
                            Security monitoring information is available to
                            administrators.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    if (loading) {
        return (
            <section className="sv-security-page">
                <div className="sv-loading-panel" role="status">
                    <span className="sv-loading-bar" aria-hidden="true" />
                    Loading security overview…
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="sv-security-page">
                <div className="sv-error-panel" role="alert">
                    <div className="sv-error-icon" aria-hidden="true">
                        <Icon name="warning" />
                    </div>
                    <div>
                        <h2>Security overview unavailable</h2>
                        <p>{error}</p>
                    </div>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadSummary()}
                    >
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    const totalEvents = Number(summary?.totalSecurityEvents) || 0;
    const successfulLogins = Number(summary?.successfulLogins) || 0;
    const failedLogins = Number(summary?.failedLogins) || 0;
    const highRiskEvents = Number(summary?.highRiskEvents) || 0;
    const mediumRiskEvents = Number(summary?.mediumRiskEvents) || 0;
    const unresolvedAlerts = Number(summary?.unresolvedAlerts) || 0;

    const percentOfTotal = (value) =>
        totalEvents > 0 ? Math.round((value / totalEvents) * 100) : 0;

    const stats = [
        {
            id: "events",
            label: "Security events",
            value: totalEvents,
            note: "All recorded events",
            icon: "activity",
            tone: "neutral",
        },
        {
            id: "success",
            label: "Successful logins",
            value: successfulLogins,
            note: `${percentOfTotal(successfulLogins)}% of events`,
            icon: "check",
            tone: "positive",
        },
        {
            id: "failed",
            label: "Failed logins",
            value: failedLogins,
            note: `${percentOfTotal(failedLogins)}% of events`,
            icon: "warning",
            tone: failedLogins > 0 ? "warning" : "neutral",
        },
        {
            id: "high",
            label: "High-risk events",
            value: highRiskEvents,
            note: "Require review",
            icon: "alerts",
            tone: highRiskEvents > 0 ? "danger" : "neutral",
        },
        {
            id: "medium",
            label: "Medium-risk events",
            value: mediumRiskEvents,
            note: "Monitor activity",
            icon: "shield",
            tone: mediumRiskEvents > 0 ? "warning" : "neutral",
        },
        {
            id: "unresolved",
            label: "Unresolved alerts",
            value: unresolvedAlerts,
            note: unresolvedAlerts > 0 ? "Action recommended" : "All cleared",
            icon: "alerts",
            tone: unresolvedAlerts > 0 ? "danger" : "positive",
        },
    ];

    return (
        <section className="sv-security-page">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Security operations</span>
                    <h1>Security Overview</h1>
                    <p>
                        System-wide authentication and risk activity for
                        SecureVault.
                    </p>
                </div>

                <div className="sv-header-actions">
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadSummary(false)}
                        disabled={refreshing}
                    >
                        <Icon name="refresh" size={16} />
                        {refreshing ? "Refreshing…" : "Refresh"}
                    </button>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={handleDownloadPdf}
                        disabled={downloadingPdf}
                    >
                        <Icon name="download" size={16} />
                        {downloadingPdf ? "Downloading…" : "PDF"}
                    </button>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={handleDownloadExcel}
                        disabled={downloadingExcel}
                    >
                        <Icon name="download" size={16} />
                        {downloadingExcel ? "Downloading…" : "Excel"}
                    </button>
                </div>
            </header>

            <div className="sv-security-summary-grid">
                {stats.map((stat) => (
                    <div className={`sv-security-stat ${stat.tone}`} key={stat.id}>
                        <span className="sv-stat-icon" aria-hidden="true">
                            <Icon name={stat.icon} size={17} />
                        </span>
                        <div>
                            <span>{stat.label}</span>
                            <strong>{stat.value}</strong>
                            <small>{stat.note}</small>
                        </div>
                    </div>
                ))}
            </div>

            <div className="sv-security-layout">
                <section className="sv-panel">
                    <div className="sv-panel-heading">
                        <div>
                            <span className="sv-eyebrow">Current status</span>
                            <h2>
                                {unresolvedAlerts === 0
                                    ? "No unresolved security alerts"
                                    : `${unresolvedAlerts} unresolved security alert${unresolvedAlerts === 1 ? "" : "s"}`}
                            </h2>
                        </div>
                        <span
                            className={`sv-status-chip ${unresolvedAlerts === 0 ? "positive" : "danger"}`}
                        >
                            {unresolvedAlerts === 0 ? "Clear" : "Review needed"}
                        </span>
                    </div>

                    <p className="sv-panel-copy">
                        {unresolvedAlerts === 0
                            ? "The security monitoring pipeline has not reported unresolved alerts. Continue reviewing login activity and access records regularly."
                            : "Unresolved alerts are waiting for an administrator review. Open Security Alerts to inspect the affected events and resolve them."}
                    </p>

                    <div className="sv-security-checklist">
                        <div>
                            <span className="sv-check-icon">
                                <Icon name="check" size={14} />
                            </span>
                            <span>Authentication events are being recorded</span>
                        </div>
                        <div>
                            <span className="sv-check-icon">
                                <Icon name="check" size={14} />
                            </span>
                            <span>Risk levels are assigned to security events</span>
                        </div>
                        <div>
                            <span className="sv-check-icon">
                                <Icon name="check" size={14} />
                            </span>
                            <span>Alert resolution is available to administrators</span>
                        </div>
                    </div>
                </section>

                <section className="sv-panel">
                    <div className="sv-panel-heading">
                        <div>
                            <span className="sv-eyebrow">Event mix</span>
                            <h2>Activity breakdown</h2>
                        </div>
                        <span className="sv-toolbar-count">
                            {totalEvents} events
                        </span>
                    </div>

                    <div className="sv-security-bars">
                        <div className="sv-security-bar-row">
                            <span>Successful logins</span>
                            <div className="sv-security-bar-track">
                                <span
                                    className="positive"
                                    style={{ width: `${percentOfTotal(successfulLogins)}%` }}
                                />
                            </div>
                            <strong>{successfulLogins}</strong>
                        </div>

                        <div className="sv-security-bar-row">
                            <span>Failed logins</span>
                            <div className="sv-security-bar-track">
                                <span
                                    className="warning"
                                    style={{ width: `${percentOfTotal(failedLogins)}%` }}
                                />
                            </div>
                            <strong>{failedLogins}</strong>
                        </div>

                        <div className="sv-security-bar-row">
                            <span>High risk</span>
                            <div className="sv-security-bar-track">
                                <span
                                    className="danger"
                                    style={{ width: `${percentOfTotal(highRiskEvents)}%` }}
                                />
                            </div>
                            <strong>{highRiskEvents}</strong>
                        </div>

                        <div className="sv-security-bar-row">
                            <span>Medium risk</span>
                            <div className="sv-security-bar-track">
                                <span
                                    className="neutral"
                                    style={{ width: `${percentOfTotal(mediumRiskEvents)}%` }}
                                />
                            </div>
                            <strong>{mediumRiskEvents}</strong>
                        </div>
                    </div>
                </section>
            </div>
        </section>
    );
}

export default SecurityOverview;
