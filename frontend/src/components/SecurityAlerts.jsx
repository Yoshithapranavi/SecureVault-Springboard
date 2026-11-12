import { useEffect, useState } from "react";

import {
    getSecurityAlerts,
    resolveSecurityAlert,
} from "../services/adminService";
import Icon from "./Icon";

function SecurityAlerts() {
    const [alerts, setAlerts] = useState([]);
    const [filter, setFilter] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [resolvingId, setResolvingId] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =========================================================
    // LOAD ALERTS
    // =========================================================

    useEffect(() => {
        loadAlerts();
        // Alerts are loaded once while the page is mounted.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadAlerts = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response = await getSecurityAlerts();

            if (Array.isArray(response)) {
                setAlerts(response);
            } else {
                setAlerts([]);
                setError("Unable to load security alerts.");
            }
        } catch (err) {
            console.error("Security alerts error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load security alerts.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // =========================================================
    // RESOLVE
    // =========================================================

    const handleResolve = async (alertId) => {
        try {
            setResolvingId(alertId);
            setError("");
            setSuccess("");

            const response = await resolveSecurityAlert(alertId);

            setAlerts((previousAlerts) =>
                previousAlerts.map((alert) =>
                    alert.id === alertId
                        ? {
                              ...alert,
                              resolved: true,
                          }
                        : alert,
                ),
            );

            setSuccess(
                response || "Security alert resolved successfully.",
            );
        } catch (err) {
            console.error("Resolve security alert error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to resolve security alert.",
            );
        } finally {
            setResolvingId(null);
        }
    };

    // =========================================================
    // FILTER
    // =========================================================

    const filteredAlerts = alerts.filter((alert) => {
        const risk = alert.riskLevel?.toUpperCase();

        if (filter === "UNRESOLVED") {
            return !alert.resolved;
        }

        if (filter === "HIGH") {
            return risk === "HIGH";
        }

        if (filter === "MEDIUM") {
            return risk === "MEDIUM";
        }

        if (filter === "LOW") {
            return risk === "LOW";
        }

        return true;
    });

    // =========================================================
    // COUNTS
    // =========================================================

    const unresolvedCount = alerts.filter((alert) => !alert.resolved).length;
    const highCount = alerts.filter(
        (alert) => alert.riskLevel?.toUpperCase() === "HIGH",
    ).length;
    const mediumCount = alerts.filter(
        (alert) => alert.riskLevel?.toUpperCase() === "MEDIUM",
    ).length;
    const lowCount = alerts.filter(
        (alert) => alert.riskLevel?.toUpperCase() === "LOW",
    ).length;

    const filterOptions = [
        { id: "ALL", label: "All alerts", count: alerts.length },
        { id: "UNRESOLVED", label: "Unresolved", count: unresolvedCount },
        { id: "HIGH", label: "High risk", count: highCount },
        { id: "MEDIUM", label: "Medium risk", count: mediumCount },
        { id: "LOW", label: "Low risk", count: lowCount },
    ];

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <section className="sv-page-stack">
                <header className="sv-page-header">
                    <div>
                        <span className="sv-eyebrow">Security operations</span>
                        <h1>Security Alerts</h1>
                        <p>Loading security alerts…</p>
                    </div>
                </header>

                <div className="sv-loading-panel" role="status">
                    <span className="sv-loading-bar" aria-hidden="true" />
                    Loading security alerts…
                </div>
            </section>
        );
    }

    return (
        <section className="sv-page-stack">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Security operations</span>
                    <h1>Security Alerts</h1>
                    <p>
                        Monitor suspicious activity and security events
                        recorded by SecureVault.
                    </p>
                </div>

                <div className="sv-header-actions">
                    <span
                        className={`sv-status-chip ${unresolvedCount > 0 ? "danger" : "positive"}`}
                    >
                        {unresolvedCount} unresolved
                    </span>

                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadAlerts(false)}
                        disabled={refreshing}
                    >
                        <Icon name="refresh" size={16} />
                        {refreshing ? "Refreshing…" : "Refresh"}
                    </button>
                </div>
            </header>

            {success && (
                <div className="sv-callout positive" role="status">
                    <Icon name="check" size={16} />
                    <div>
                        <strong>Alert resolved</strong>
                        <span>{success}</span>
                    </div>
                </div>
            )}

            {error && (
                <div className="sv-inline-error" role="alert">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadAlerts()}
                    >
                        Try again
                    </button>
                </div>
            )}

            <div className="sv-filter-row" role="group" aria-label="Filter alerts">
                {filterOptions.map((option) => (
                    <button
                        key={option.id}
                        type="button"
                        className={`sv-filter-button ${filter === option.id ? "is-active" : ""}`}
                        onClick={() => setFilter(option.id)}
                        aria-pressed={filter === option.id}
                    >
                        {option.label}
                        <strong>{option.count}</strong>
                    </button>
                ))}
            </div>

            {filteredAlerts.length === 0 ? (
                <div className="sv-empty-state large">
                    <span className="sv-empty-icon positive" aria-hidden="true">
                        <Icon name="shield" size={22} />
                    </span>
                    <div>
                        <h2>No alerts found</h2>
                        <p>
                            There are no security alerts matching this filter.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="sv-alert-feed">
                    {filteredAlerts.map((alert) => {
                        const risk =
                            alert.riskLevel?.toUpperCase() || "UNKNOWN";

                        const alertType =
                            alert.alertType?.replaceAll("_", " ") ||
                            "Security Alert";

                        return (
                            <article
                                key={alert.id}
                                className={`sv-alert-card ${risk.toLowerCase()} ${alert.resolved ? "is-resolved" : ""}`}
                            >
                                <div className="sv-alert-card-head">
                                    <div className="sv-alert-card-title">
                                        <span
                                            className={`sv-risk-badge ${risk.toLowerCase()}`}
                                        >
                                            {risk}
                                        </span>
                                        <h3>{alertType}</h3>
                                    </div>

                                    <span
                                        className={`sv-status-chip ${alert.resolved ? "positive" : "warning"}`}
                                    >
                                        {alert.resolved
                                            ? "Resolved"
                                            : "Unresolved"}
                                    </span>
                                </div>

                                <p className="sv-alert-card-body">
                                    {alert.message ||
                                        "No additional information available."}
                                </p>

                                <div className="sv-alert-card-details">
                                    <div>
                                        <span>User</span>
                                        <strong>
                                            {alert.email || "Not available"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>User ID</span>
                                        <strong>
                                            {alert.userId
                                                ? `#${alert.userId}`
                                                : "Not available"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Detected</span>
                                        <strong>
                                            {alert.timestamp
                                                ? new Date(
                                                      alert.timestamp,
                                                  ).toLocaleString()
                                                : "Not recorded"}
                                        </strong>
                                    </div>
                                </div>

                                {!alert.resolved && (
                                    <div className="sv-alert-card-actions">
                                        <button
                                            type="button"
                                            className="sv-btn sv-btn-secondary"
                                            disabled={resolvingId === alert.id}
                                            onClick={() =>
                                                handleResolve(alert.id)
                                            }
                                        >
                                            <Icon name="check" size={15} />
                                            {resolvingId === alert.id
                                                ? "Resolving…"
                                                : "Mark as resolved"}
                                        </button>
                                    </div>
                                )}
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default SecurityAlerts;
