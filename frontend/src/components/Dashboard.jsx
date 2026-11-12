import { useEffect, useState } from "react";
import { getDashboard } from "../services/adminService";
import { getPasswordHealth } from "../services/vaultService";
import Icon from "./Icon";

function formatAction(action) {
    if (!action) return "Activity recorded";

    return action
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

function formatDateTime(value) {
    if (!value) return "Time unavailable";

    return new Date(value).toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function Dashboard({ user, onNavigate }) {
    const [dashboard, setDashboard] = useState(null);
    const [health, setHealth] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user?.id) {
            loadDashboard();
        }
        // The dashboard is scoped to the authenticated user.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [dashboardResult, healthResult] = await Promise.allSettled([
                getDashboard(),
                getPasswordHealth(),
            ]);

            if (dashboardResult.status === "rejected") {
                throw dashboardResult.reason;
            }

            const response = dashboardResult.value;

            if (response?.success === false) {
                setError(response.message || "Unable to load dashboard.");
                return;
            }

            setDashboard(response || {});

            if (
                healthResult.status === "fulfilled" &&
                healthResult.value?.success
            ) {
                setHealth(healthResult.value.data || null);
            } else {
                setHealth(null);
            }
        } catch (err) {
            console.error("Dashboard loading error:", err);

            setError(
                err.response?.data?.message || "Unable to load dashboard.",
            );
        } finally {
            setLoading(false);
        }
    };

    const totalCredentials = Number(dashboard?.totalCredentials) || 0;
    const sharedCredentials = Number(dashboard?.sharedCredentials) || 0;
    const weakPasswords = Number(dashboard?.weakPasswordCount) || 0;
    const failedLogins = Number(dashboard?.failedLoginCount) || 0;
    const alerts = Array.isArray(dashboard?.recentSecurityAlerts)
        ? dashboard.recentSecurityAlerts
        : [];
    const recentActivity = Array.isArray(dashboard?.recentUserActivity)
        ? dashboard.recentUserActivity
        : [];

    const strongPasswords = Number(health?.strongPasswords) || 0;
    const mediumPasswords = Number(health?.mediumPasswords) || 0;
    const healthTotal = Number(health?.totalCredentials) || totalCredentials;

    const derivedHealth =
        healthTotal > 0
            ? Math.round(((healthTotal - weakPasswords) / healthTotal) * 100)
            : 0;

    const healthScore = health
        ? Math.max(0, Math.min(100, Math.round(Number(health.healthPercentage) || 0)))
        : derivedHealth;

    let postureLabel = "Needs attention";
    let postureTone = "warning";

    if (totalCredentials === 0) {
        postureLabel = "Vault is empty";
        postureTone = "neutral";
    } else if (healthScore >= 80) {
        postureLabel = "Strong posture";
        postureTone = "positive";
    } else if (healthScore >= 60) {
        postureLabel = "Reasonable posture";
        postureTone = "neutral";
    }

    const firstName = user?.name?.split(" ")[0] || "there";

    const priorityActions = [];

    if (weakPasswords > 0) {
        priorityActions.push({
            id: "weak",
            tone: "warning",
            icon: "warning",
            title: "Update weak passwords",
            detail: `${weakPasswords} credential${weakPasswords === 1 ? "" : "s"} fall below the current strength criteria.`,
            action: "health",
            actionLabel: "Review passwords",
        });
    }

    if (failedLogins > 0) {
        priorityActions.push({
            id: "failed-logins",
            tone: "warning",
            icon: "activity",
            title: "Review failed sign-in attempts",
            detail: `${failedLogins} failed sign-in attempt${failedLogins === 1 ? "" : "s"} recorded for your account.`,
            action: "activity",
            actionLabel: "View login activity",
        });
    }

    if (alerts.length > 0) {
        priorityActions.push({
            id: "alerts",
            tone: "danger",
            icon: "alerts",
            title: "Check recent security alerts",
            detail: `${alerts.length} recent alert${alerts.length === 1 ? "" : "s"} may require review.`,
            action: "alerts",
            actionLabel: "Open alerts",
        });
    }

    if (sharedCredentials > 0) {
        priorityActions.push({
            id: "shared",
            tone: "info",
            icon: "shared",
            title: "Audit shared access",
            detail: `${sharedCredentials} credential${sharedCredentials === 1 ? "" : "s"} currently shared with your account.`,
            action: "shared",
            actionLabel: "Review sharing",
        });
    }

    if (priorityActions.length === 0 && totalCredentials > 0) {
        priorityActions.push({
            id: "all-clear",
            tone: "positive",
            icon: "check",
            title: "No urgent action required",
            detail:
                "Your recent security checks are clear. Keep credentials unique and review access regularly.",
            action: "security",
            actionLabel: "View security overview",
        });
    }

    const quickTools = [
        {
            id: "vault",
            icon: "vault",
            title: "Password Vault",
            detail: "Open your saved credentials",
        },
        {
            id: "generator",
            icon: "generator",
            title: "Password Generator",
            detail: "Create a strong, unique password",
        },
        {
            id: "health",
            icon: "health",
            title: "Password Health",
            detail: "Review password strength",
        },
        {
            id: "devices",
            icon: "devices",
            title: "Trusted Devices",
            detail: "Review account access",
        },
    ];

    if (loading) {
        return (
            <section className="sv-dashboard-page">
                <div className="sv-page-header">
                    <div>
                        <span className="sv-eyebrow">Workspace overview</span>
                        <h1>Security dashboard</h1>
                        <p>Preparing your security overview…</p>
                    </div>
                </div>

                <div className="sv-loading-panel" role="status">
                    <span className="sv-loading-bar" aria-hidden="true" />
                    Loading vault and security data…
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="sv-dashboard-page">
                <div className="sv-page-header">
                    <div>
                        <span className="sv-eyebrow">Workspace overview</span>
                        <h1>Security dashboard</h1>
                    </div>
                </div>

                <div className="sv-error-panel" role="alert">
                    <div className="sv-error-icon" aria-hidden="true">
                        <Icon name="warning" />
                    </div>
                    <div>
                        <h2>Dashboard unavailable</h2>
                        <p>{error}</p>
                    </div>
                    <button type="button" className="sv-btn sv-btn-secondary" onClick={loadDashboard}>
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="sv-dashboard-page">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Workspace overview</span>
                    <h1>Security dashboard</h1>
                    <p>
                        Good to see you, {firstName}. Here is the current state of
                        your vault and account security.
                    </p>
                </div>

                <div className="sv-header-actions">
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={loadDashboard}
                    >
                        <Icon name="refresh" size={16} />
                        Refresh
                    </button>
                    <button
                        type="button"
                        className="sv-btn sv-btn-primary"
                        onClick={() => onNavigate("vault")}
                    >
                        <Icon name="plus" size={16} />
                        Add credential
                    </button>
                </div>
            </header>

            <div className="sv-dashboard-grid">
                <section className="sv-posture-panel">
                    <div className="sv-panel-heading">
                        <div>
                            <span className="sv-eyebrow">Security posture</span>
                            <h2>Password health</h2>
                        </div>
                        <span className={`sv-status-chip ${postureTone}`}>
                            {postureLabel}
                        </span>
                    </div>

                    <div className="sv-posture-body">
                        <div
                            className={`sv-score-ring ${postureTone}`}
                            style={{ "--score": `${healthScore * 3.6}deg` }}
                            role="img"
                            aria-label={`Password health score ${healthScore} percent`}
                        >
                            <div className="sv-score-inner">
                                <strong>{totalCredentials === 0 ? "—" : `${healthScore}%`}</strong>
                                <span>password health</span>
                            </div>
                        </div>

                        <div className="sv-posture-copy">
                            <h3>
                                {totalCredentials === 0
                                    ? "Add a credential to begin"
                                    : weakPasswords > 0
                                      ? `${weakPasswords} password${weakPasswords === 1 ? "" : "s"} need${weakPasswords === 1 ? "s" : ""} attention`
                                      : "Saved passwords meet the strength criteria"}
                            </h3>
                            <p>
                                {totalCredentials === 0
                                    ? "Your vault is ready. Add your first credential and SecureVault will begin reporting password health."
                                    : health
                                      ? `${strongPasswords} strong and ${mediumPasswords} medium-strength passwords across ${healthTotal} stored credentials.`
                                      : "Health data is currently unavailable. The score shown is based on the number of weak passwords reported by the vault."}
                            </p>

                            <div className="sv-health-legend">
                                <span>
                                    <i className="positive" />
                                    {strongPasswords} strong
                                </span>
                                <span>
                                    <i className="neutral" />
                                    {mediumPasswords} medium
                                </span>
                                <span>
                                    <i className="warning" />
                                    {weakPasswords} weak
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="sv-posture-footer">
                        <span>
                            {totalCredentials === 0
                                ? "No stored credentials yet."
                                : `${totalCredentials} credential${totalCredentials === 1 ? "" : "s"} protected in your vault.`}
                        </span>
                        <button
                            type="button"
                            className="sv-text-link"
                            onClick={() => onNavigate("health")}
                        >
                            Open password health
                            <Icon name="arrowRight" size={15} />
                        </button>
                    </div>
                </section>

                <section className="sv-priority-panel">
                    <div className="sv-panel-heading">
                        <div>
                            <span className="sv-eyebrow">Recommended</span>
                            <h2>Priority actions</h2>
                        </div>
                    </div>

                    <div className="sv-priority-list">
                        {priorityActions.map((item) => (
                            <button
                                type="button"
                                key={item.id}
                                className={`sv-priority-item ${item.tone}`}
                                onClick={() => onNavigate(item.action)}
                            >
                                <span className="sv-priority-icon" aria-hidden="true">
                                    <Icon name={item.icon} size={18} />
                                </span>
                                <span className="sv-priority-copy">
                                    <strong>{item.title}</strong>
                                    <span>{item.detail}</span>
                                </span>
                                <span className="sv-priority-action">
                                    {item.actionLabel}
                                    <Icon name="arrowRight" size={14} />
                                </span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            <div className="sv-stat-row">
                <button
                    type="button"
                    className="sv-stat-card"
                    onClick={() => onNavigate("vault")}
                >
                    <span className="sv-stat-icon">
                        <Icon name="vault" size={18} />
                    </span>
                    <span className="sv-stat-copy">
                        <span>Vault items</span>
                        <strong>{totalCredentials}</strong>
                        <small>Credentials secured</small>
                    </span>
                </button>

                <button
                    type="button"
                    className="sv-stat-card"
                    onClick={() => onNavigate("shared")}
                >
                    <span className="sv-stat-icon">
                        <Icon name="shared" size={18} />
                    </span>
                    <span className="sv-stat-copy">
                        <span>Shared access</span>
                        <strong>{sharedCredentials}</strong>
                        <small>Credentials shared with you</small>
                    </span>
                </button>

                <button
                    type="button"
                    className={`sv-stat-card ${weakPasswords > 0 ? "is-warning" : "is-positive"}`}
                    onClick={() => onNavigate("health")}
                >
                    <span className="sv-stat-icon">
                        <Icon name="warning" size={18} />
                    </span>
                    <span className="sv-stat-copy">
                        <span>Weak passwords</span>
                        <strong>{weakPasswords}</strong>
                        <small>
                            {weakPasswords > 0 ? "Needs attention" : "No weak passwords"}
                        </small>
                    </span>
                </button>

                <button
                    type="button"
                    className={`sv-stat-card ${failedLogins > 0 ? "is-warning" : ""}`}
                    onClick={() => onNavigate("activity")}
                >
                    <span className="sv-stat-icon">
                        <Icon name="activity" size={18} />
                    </span>
                    <span className="sv-stat-copy">
                        <span>Failed sign-ins</span>
                        <strong>{failedLogins}</strong>
                        <small>Recorded login attempts</small>
                    </span>
                </button>
            </div>

            <div className="sv-dashboard-lower">
                <section className="sv-panel sv-activity-panel">
                    <div className="sv-panel-heading">
                        <div>
                            <span className="sv-eyebrow">Account activity</span>
                            <h2>Recent activity</h2>
                        </div>
                        <button
                            type="button"
                            className="sv-text-link"
                            onClick={() => onNavigate("activity")}
                        >
                            View all
                            <Icon name="arrowRight" size={15} />
                        </button>
                    </div>

                    {recentActivity.length > 0 ? (
                        <div className="sv-activity-list">
                            {recentActivity.slice(0, 6).map((entry, index) => (
                                <div className="sv-activity-row" key={entry.id || index}>
                                    <span className="sv-activity-icon" aria-hidden="true">
                                        <Icon name="activity" size={16} />
                                    </span>
                                    <div className="sv-activity-copy">
                                        <strong>{formatAction(entry.action)}</strong>
                                        <span>
                                            {entry.entityType
                                                ? `${entry.entityType}${entry.entityId ? ` #${entry.entityId}` : ""}`
                                                : "SecureVault"}
                                            {entry.performedBy ? ` · ${entry.performedBy}` : ""}
                                        </span>
                                    </div>
                                    <time>{formatDateTime(entry.timestamp)}</time>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="sv-empty-state">
                            <span className="sv-empty-icon" aria-hidden="true">
                                <Icon name="clock" size={20} />
                            </span>
                            <div>
                                <strong>No recent activity</strong>
                                <p>Account activity will appear here as you use the vault.</p>
                            </div>
                        </div>
                    )}
                </section>

                <section className="sv-panel sv-alerts-panel">
                    <div className="sv-panel-heading">
                        <div>
                            <span className="sv-eyebrow">Monitoring</span>
                            <h2>Recent security alerts</h2>
                        </div>
                        <button
                            type="button"
                            className="sv-text-link"
                            onClick={() => onNavigate("alerts")}
                        >
                            View all
                            <Icon name="arrowRight" size={15} />
                        </button>
                    </div>

                    {alerts.length > 0 ? (
                        <div className="sv-alert-list">
                            {alerts.slice(0, 5).map((alert) => {
                                const risk = String(alert.riskLevel || "LOW").toLowerCase();

                                return (
                                    <div className="sv-alert-row" key={alert.id}>
                                        <span className={`sv-risk-badge ${risk}`}>
                                            {alert.riskLevel || "LOW"}
                                        </span>
                                        <div className="sv-alert-copy">
                                            <strong>{formatAction(alert.alertType)}</strong>
                                            <span>{alert.message}</span>
                                        </div>
                                        <time>{formatDateTime(alert.timestamp)}</time>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="sv-empty-state">
                            <span className="sv-empty-icon positive" aria-hidden="true">
                                <Icon name="check" size={20} />
                            </span>
                            <div>
                                <strong>No recent security alerts</strong>
                                <p>Your account has no new security events to review.</p>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            <section className="sv-panel sv-tools-panel">
                <div className="sv-panel-heading">
                    <div>
                        <span className="sv-eyebrow">Shortcuts</span>
                        <h2>Quick tools</h2>
                    </div>
                </div>

                <div className="sv-tool-grid">
                    {quickTools.map((tool) => (
                        <button
                            type="button"
                            className="sv-tool-card"
                            key={tool.id}
                            onClick={() => onNavigate(tool.id)}
                        >
                            <span className="sv-tool-icon" aria-hidden="true">
                                <Icon name={tool.icon} size={18} />
                            </span>
                            <span>
                                <strong>{tool.title}</strong>
                                <small>{tool.detail}</small>
                            </span>
                            <Icon name="arrowUpRight" size={15} />
                        </button>
                    ))}
                </div>
            </section>
        </section>
    );
}

export default Dashboard;
