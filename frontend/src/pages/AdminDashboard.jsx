import { useEffect, useState } from "react";

import {
    getSecuritySummary,
    getAuditLogs,
    getAllUsers,
} from "../services/adminService";
import Icon from "../components/Icon";

function AdminDashboard({ onGoToVault, onNavigate }) {
    const [summary, setSummary] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    // =========================================================
    // LOAD ALL ADMIN DATA
    // =========================================================

    useEffect(() => {
        loadAdminData();
        // Admin data is loaded once while the page is mounted.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadAdminData = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const summaryResponse = await getSecuritySummary();
            const auditResponse = await getAuditLogs();
            const usersResponse = await getAllUsers();

            setSummary(summaryResponse || {});
            setAuditLogs(Array.isArray(auditResponse) ? auditResponse : []);
            setUsers(usersResponse?.data || []);
        } catch (err) {
            console.error("Admin dashboard error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load admin dashboard.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // =========================================================
    // FORMAT ACTION
    // =========================================================

    const formatAction = (action) => {
        if (!action) {
            return "Unknown action";
        }

        return action
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (character) => character.toUpperCase());
    };

    const goTo = (section) => {
        if (typeof onNavigate === "function") {
            onNavigate(section);
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <section className="sv-page-stack">
                <header className="sv-page-header">
                    <div>
                        <span className="sv-eyebrow">Administration</span>
                        <h1>Admin Overview</h1>
                        <p>Loading system security data…</p>
                    </div>
                </header>

                <div className="sv-loading-panel" role="status">
                    <span className="sv-loading-bar" aria-hidden="true" />
                    Loading admin dashboard…
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

    const stats = [
        {
            id: "events",
            label: "Security events",
            value: totalEvents,
            note: "All recorded events",
            tone: "neutral",
        },
        {
            id: "success",
            label: "Successful logins",
            value: successfulLogins,
            note: "Completed sign-ins",
            tone: "positive",
        },
        {
            id: "failed",
            label: "Failed logins",
            value: failedLogins,
            note: "Rejected attempts",
            tone: failedLogins > 0 ? "warning" : "neutral",
        },
        {
            id: "high",
            label: "High-risk events",
            value: highRiskEvents,
            note: "Require review",
            tone: highRiskEvents > 0 ? "danger" : "neutral",
        },
        {
            id: "medium",
            label: "Medium-risk events",
            value: mediumRiskEvents,
            note: "Monitor activity",
            tone: mediumRiskEvents > 0 ? "warning" : "neutral",
        },
        {
            id: "unresolved",
            label: "Unresolved alerts",
            value: unresolvedAlerts,
            note: unresolvedAlerts > 0 ? "Action recommended" : "All cleared",
            tone: unresolvedAlerts > 0 ? "danger" : "positive",
        },
    ];

    const recentUsers = users.slice(0, 5);
    const recentLogs = auditLogs.slice(0, 6);

    return (
        <section className="sv-page-stack">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Administration</span>
                    <h1>Admin Overview</h1>
                    <p>
                        System-wide security posture, registered accounts and
                        recent audit activity.
                    </p>
                </div>

                <div className="sv-header-actions">
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadAdminData(false)}
                        disabled={refreshing}
                    >
                        <Icon name="refresh" size={16} />
                        {refreshing ? "Refreshing…" : "Refresh"}
                    </button>

                    <button
                        type="button"
                        className="sv-btn sv-btn-primary"
                        onClick={onGoToVault}
                    >
                        <Icon name="vault" size={16} />
                        My vault
                    </button>
                </div>
            </header>

            {error && (
                <div className="sv-inline-error" role="alert">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadAdminData()}
                    >
                        Try again
                    </button>
                </div>
            )}

            <div className="sv-admin-grid">
                {stats.map((stat) => (
                    <div
                        className={`sv-admin-stat ${stat.tone}`}
                        key={stat.id}
                    >
                        <div>
                            <span>{stat.label}</span>
                            <strong>{stat.value}</strong>
                            <small>{stat.note}</small>
                        </div>
                    </div>
                ))}
            </div>

            {unresolvedAlerts > 0 ? (
                <div className="sv-callout warning">
                    <Icon name="alerts" size={17} />
                    <div>
                        <strong>
                            {unresolvedAlerts} unresolved security alert
                            {unresolvedAlerts === 1 ? "" : "s"}
                        </strong>
                        <span>
                            Review the affected events and mark them as
                            resolved once investigated.
                        </span>
                    </div>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => goTo("alerts")}
                    >
                        Review alerts
                    </button>
                </div>
            ) : (
                <div className="sv-callout positive">
                    <Icon name="check" size={17} />
                    <div>
                        <strong>No unresolved security alerts</strong>
                        <span>
                            Continue monitoring login activity and audit
                            records.
                        </span>
                    </div>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => goTo("alerts")}
                    >
                        View alerts
                    </button>
                </div>
            )}

            <div className="sv-admin-columns">
                <section>
                    <div className="sv-section-heading">
                        <div>
                            <h2>Registered users</h2>
                            <p>
                                {users.length}{" "}
                                {users.length === 1 ? "account" : "accounts"}{" "}
                                in SecureVault
                            </p>
                        </div>

                        <button
                            type="button"
                            className="sv-text-link"
                            onClick={() => goTo("users")}
                        >
                            View all
                            <Icon name="arrowRight" size={14} />
                        </button>
                    </div>

                    {recentUsers.length === 0 ? (
                        <div className="sv-table-shell">
                            <div className="sv-empty-state">
                                <div>
                                    <h3>No users found</h3>
                                    <p>
                                        Registered accounts will appear here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="sv-table-shell sv-table-scroll">
                            <table className="sv-data-table">
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Role</th>
                                        <th>Registered</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>
                                                <div className="sv-table-user">
                                                    <span
                                                        className="sv-table-avatar"
                                                        aria-hidden="true"
                                                    >
                                                        {user.name
                                                            ?.charAt(0)
                                                            .toUpperCase() ||
                                                            "?"}
                                                    </span>
                                                    <div>
                                                        <strong>
                                                            {user.name ||
                                                                "Unknown User"}
                                                        </strong>
                                                        <small
                                                            style={{
                                                                display:
                                                                    "block",
                                                                color: "var(--rd-muted)",
                                                                fontSize:
                                                                    "10px",
                                                            }}
                                                        >
                                                            {user.email}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>
                                                <span
                                                    className={`sv-role-badge ${user.role === "ADMIN" ? "admin" : ""}`}
                                                >
                                                    {user.role || "USER"}
                                                </span>
                                            </td>

                                            <td>
                                                {user.createdAt
                                                    ? new Date(
                                                          user.createdAt,
                                                      ).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section>
                    <div className="sv-section-heading">
                        <div>
                            <h2>Recent audit activity</h2>
                            <p>Latest credential and security operations</p>
                        </div>

                        <button
                            type="button"
                            className="sv-text-link"
                            onClick={() => goTo("audit")}
                        >
                            View all
                            <Icon name="arrowRight" size={14} />
                        </button>
                    </div>

                    {recentLogs.length === 0 ? (
                        <div className="sv-table-shell">
                            <div className="sv-empty-state">
                                <div>
                                    <h3>No audit activity found</h3>
                                    <p>
                                        Recorded operations will appear here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="sv-table-shell sv-table-scroll">
                            <table className="sv-data-table">
                                <thead>
                                    <tr>
                                        <th>Action</th>
                                        <th>Entity</th>
                                        <th>Timestamp</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {recentLogs.map((log) => (
                                        <tr key={log.id}>
                                            <td>
                                                <span className="sv-action-tag">
                                                    {formatAction(
                                                        log.action,
                                                    )}
                                                </span>
                                            </td>

                                            <td>
                                                {log.entityType || "—"}
                                                {log.entityId != null
                                                    ? ` #${log.entityId}`
                                                    : ""}
                                            </td>

                                            <td>
                                                {log.timestamp
                                                    ? new Date(
                                                          log.timestamp,
                                                      ).toLocaleString()
                                                    : "—"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </section>
    );
}

export default AdminDashboard;
