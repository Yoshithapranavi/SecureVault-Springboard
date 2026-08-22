import { useEffect, useState } from "react";
import { getDashboard } from "../services/adminService";

function Dashboard({ user, onNavigate }) {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user?.id) {
            loadDashboard();
        }
    }, [user?.id]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getDashboard();

            if (response?.success === false) {
                setError(
                    response.message ||
                    "Unable to load dashboard."
                );
                return;
            }

            setDashboard(response);
        } catch (err) {
            console.error(
                "Dashboard loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    const totalCredentials =
        dashboard?.totalCredentials ?? 0;

    const sharedCredentials =
        dashboard?.sharedCredentials ?? 0;

    const weakPasswords =
        dashboard?.weakPasswordCount ?? 0;

    const failedLogins =
        dashboard?.failedLoginCount ?? 0;

    const alerts =
        dashboard?.recentSecurityAlerts || [];

    const firstName =
        user?.name?.split(" ")[0] || "there";

    if (loading) {
        return (
            <section className="sv-dashboard-page sv-dashboard-loading">
                <div className="sv-loading-orb">
                    <div></div>
                </div>

                <p>Securing your workspace...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="sv-dashboard-page">
                <div className="sv-error-panel">
                    <div className="sv-error-icon">!</div>

                    <div>
                        <h3>Dashboard unavailable</h3>
                        <p>{error}</p>
                    </div>

                    <button
                        type="button"
                        onClick={loadDashboard}
                    >
                        Try again
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="sv-dashboard-page">

            {/* =====================================================
                TOP BAR
            ===================================================== */}

            <header className="sv-dashboard-header">

                <div className="sv-dashboard-heading">

                    <span className="sv-overline">
                        SECURE WORKSPACE
                    </span>

                    <h1>
                        Good to see you, {firstName}.
                    </h1>

                    <p>
                        Your credentials and security
                        activity are all in one place.
                    </p>

                </div>

                <div className="sv-dashboard-header-actions">

                    <button
                        type="button"
                        className="sv-secondary-action"
                        onClick={loadDashboard}
                        disabled={loading}
                    >
                        <span className="sv-refresh-icon">
                            ↻
                        </span>

                        Refresh
                    </button>

                    <button
                        type="button"
                        className="sv-primary-action"
                        onClick={() =>
                            onNavigate("vault")
                        }
                    >
                        Open Vault
                        <span>↗</span>
                    </button>

                </div>

            </header>


            {/* =====================================================
                HERO SECURITY PANEL
            ===================================================== */}

            <div className="sv-security-hero">

                <div className="sv-hero-content">

                    <div className="sv-live-status">
                        <span className="sv-live-dot"></span>
                        VAULT STATUS
                    </div>

                    <h2>
                        Your digital credentials,
                        <br />
                        <span>protected by design.</span>
                    </h2>

                    <p>
                        SecureVault keeps your credentials
                        organized while encryption,
                        authentication and security monitoring
                        work quietly in the background.
                    </p>

                    <div className="sv-hero-actions">

                        <button
                            type="button"
                            className="sv-hero-primary"
                            onClick={() =>
                                onNavigate("vault")
                            }
                        >
                            Enter my vault
                            <span>→</span>
                        </button>

                        <button
                            type="button"
                            className="sv-hero-secondary"
                            onClick={() =>
                                onNavigate("security")
                            }
                        >
                            Security overview
                        </button>

                    </div>

                </div>


                {/* =================================================
                    ANIMATED SECURITY CORE
                ================================================= */}

                <div className="sv-security-visual">

                    <div className="sv-orbit sv-orbit-one"></div>

                    <div className="sv-orbit sv-orbit-two"></div>

                    <div className="sv-orbit sv-orbit-three"></div>

                    <div className="sv-security-grid"></div>

                    <div className="sv-security-core">

                        <div className="sv-core-inner">
                            <span>SV</span>
                        </div>

                    </div>

                    <span className="sv-orbit-dot sv-dot-one"></span>
                    <span className="sv-orbit-dot sv-dot-two"></span>
                    <span className="sv-orbit-dot sv-dot-three"></span>

                </div>

            </div>


            {/* =====================================================
                STAT STRIP
            ===================================================== */}

            <div className="sv-stat-strip">

                <button
                    type="button"
                    className="sv-stat-item"
                    onClick={() =>
                        onNavigate("vault")
                    }
                >
                    <span className="sv-stat-label">
                        VAULT ITEMS
                    </span>

                    <strong>
                        {totalCredentials}
                    </strong>

                    <span className="sv-stat-note">
                        Credentials secured
                    </span>

                    <span className="sv-stat-arrow">
                        →
                    </span>
                </button>


                <button
                    type="button"
                    className="sv-stat-item"
                    onClick={() =>
                        onNavigate("shared")
                    }
                >
                    <span className="sv-stat-label">
                        SHARED ACCESS
                    </span>

                    <strong>
                        {sharedCredentials}
                    </strong>

                    <span className="sv-stat-note">
                        Shared with you
                    </span>

                    <span className="sv-stat-arrow">
                        →
                    </span>
                </button>


                <button
                    type="button"
                    className={`sv-stat-item ${weakPasswords > 0
                            ? "sv-stat-warning"
                            : "sv-stat-good"
                        }`}
                    onClick={() =>
                        onNavigate("health")
                    }
                >
                    <span className="sv-stat-label">
                        PASSWORD HEALTH
                    </span>

                    <strong>
                        {weakPasswords}
                    </strong>

                    <span className="sv-stat-note">
                        {weakPasswords > 0
                            ? "Need attention"
                            : "No weak passwords"}
                    </span>

                    <span className="sv-stat-arrow">
                        →
                    </span>
                </button>


                <div className="sv-stat-item sv-stat-security">

                    <span className="sv-stat-label">
                        SECURITY EVENTS
                    </span>

                    <strong>
                        {failedLogins}
                    </strong>

                    <span className="sv-stat-note">
                        Failed login attempts
                    </span>

                    <span className="sv-security-status">
                        <span></span>
                        MONITORED
                    </span>

                </div>

            </div>


            {/* =====================================================
                MAIN LOWER GRID
            ===================================================== */}

            <div className="sv-dashboard-lower">

                {/* =================================================
                    QUICK ACCESS
                ================================================= */}

                <section className="sv-dashboard-card sv-quick-card">

                    <div className="sv-card-heading">

                        <div>
                            <span className="sv-card-overline">
                                SHORTCUTS
                            </span>

                            <h2>
                                Jump back in
                            </h2>

                            <p>
                                Your most useful security tools.
                            </p>
                        </div>

                    </div>


                    <div className="sv-quick-grid">

                        <button
                            type="button"
                            onClick={() =>
                                onNavigate("vault")
                            }
                        >
                            <span className="sv-quick-icon">
                                ◈
                            </span>

                            <span className="sv-quick-text">
                                <strong>
                                    My Vault
                                </strong>

                                <small>
                                    Manage credentials
                                </small>
                            </span>

                            <span className="sv-quick-arrow">
                                ↗
                            </span>
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                onNavigate("generator")
                            }
                        >
                            <span className="sv-quick-icon">
                                ✦
                            </span>

                            <span className="sv-quick-text">
                                <strong>
                                    Password Generator
                                </strong>

                                <small>
                                    Create a strong password
                                </small>
                            </span>

                            <span className="sv-quick-arrow">
                                ↗
                            </span>
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                onNavigate("health")
                            }
                        >
                            <span className="sv-quick-icon">
                                ◒
                            </span>

                            <span className="sv-quick-text">
                                <strong>
                                    Password Health
                                </strong>

                                <small>
                                    Review password strength
                                </small>
                            </span>

                            <span className="sv-quick-arrow">
                                ↗
                            </span>
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                onNavigate("shared")
                            }
                        >
                            <span className="sv-quick-icon">
                                ⇄
                            </span>

                            <span className="sv-quick-text">
                                <strong>
                                    Shared With Me
                                </strong>

                                <small>
                                    View shared credentials
                                </small>
                            </span>

                            <span className="sv-quick-arrow">
                                ↗
                            </span>
                        </button>

                    </div>

                </section>


                {/* =================================================
                    SECURITY PULSE
                ================================================= */}

                <section className="sv-dashboard-card sv-pulse-card">

                    <div className="sv-card-heading">

                        <div>
                            <span className="sv-card-overline">
                                SECURITY PULSE
                            </span>

                            <h2>
                                All systems active
                            </h2>
                        </div>

                        <span className="sv-pulse-live">
                            LIVE
                        </span>

                    </div>


                    <div className="sv-security-checks">

                        <div className="sv-security-check">
                            <span className="sv-check-mark">
                                ✓
                            </span>

                            <div>
                                <strong>
                                    Encrypted vault
                                </strong>

                                <small>
                                    Credential protection active
                                </small>
                            </div>

                            <span className="sv-check-active">
                                ACTIVE
                            </span>
                        </div>


                        <div className="sv-security-check">
                            <span className="sv-check-mark">
                                ✓
                            </span>

                            <div>
                                <strong>
                                    Authentication
                                </strong>

                                <small>
                                    Account access protected
                                </small>
                            </div>

                            <span className="sv-check-active">
                                ACTIVE
                            </span>
                        </div>


                        <div className="sv-security-check">
                            <span className="sv-check-mark">
                                ✓
                            </span>

                            <div>
                                <strong>
                                    Activity monitoring
                                </strong>

                                <small>
                                    Security events monitored
                                </small>
                            </div>

                            <span className="sv-check-active">
                                ACTIVE
                            </span>
                        </div>

                    </div>


                    <button
                        type="button"
                        className="sv-text-action"
                        onClick={() =>
                            onNavigate("security")
                        }
                    >
                        View security center
                        <span>→</span>
                    </button>

                </section>

            </div>


            {/* =====================================================
                RECENT ACTIVITY
            ===================================================== */}

            <section className="sv-dashboard-card sv-activity-card">

                <div className="sv-card-heading">

                    <div>
                        <span className="sv-card-overline">
                            SECURITY ACTIVITY
                        </span>

                        <h2>
                            Recent alerts
                        </h2>

                        <p>
                            Keep an eye on activity associated
                            with your account.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="sv-text-action"
                        onClick={() =>
                            onNavigate("alerts")
                        }
                    >
                        View all
                        <span>→</span>
                    </button>

                </div>


                {alerts.length > 0 ? (

                    <div className="sv-activity-list">

                        {alerts
                            .slice(0, 5)
                            .map((alert) => (

                                <div
                                    className="sv-activity-row"
                                    key={alert.id}
                                >

                                    <div className="sv-activity-indicator">
                                        <span></span>
                                    </div>

                                    <div className="sv-activity-main">

                                        <strong>
                                            {alert.alertType}
                                        </strong>

                                        <span>
                                            {alert.message}
                                        </span>

                                    </div>

                                    <span
                                        className={`sv-risk-badge ${String(
                                            alert.riskLevel || ""
                                        ).toLowerCase()
                                            }`}
                                    >
                                        {alert.riskLevel}
                                    </span>

                                    <span className="sv-activity-arrow">
                                        →
                                    </span>

                                </div>

                            ))}

                    </div>

                ) : (

                    <div className="sv-empty-activity">

                        <div className="sv-empty-icon">
                            ✓
                        </div>

                        <div>
                            <strong>
                                No recent security alerts
                            </strong>

                            <span>
                                Your account has no new
                                security events to review.
                            </span>
                        </div>

                    </div>

                )}

            </section>

        </section>
    );
}

export default Dashboard;