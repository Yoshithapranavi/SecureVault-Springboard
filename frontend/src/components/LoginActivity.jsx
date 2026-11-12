import { useEffect, useState } from "react";

import { getLoginActivity } from "../services/adminService";
import { useAuth } from "../context/AuthContext";
import Icon from "./Icon";

function LoginActivity() {
    const { user, isAdmin } = useAuth();

    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [filter, setFilter] = useState("ALL");

    // =========================================================
    // LOAD
    // =========================================================

    useEffect(() => {
        if (!isAdmin || !user?.email) {
            setLoading(false);
            return;
        }

        loadActivity();
        // Activity is reloaded when the signed-in administrator changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAdmin, user?.email]);

    const loadActivity = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response = await getLoginActivity(user.email);

            if (Array.isArray(response)) {
                setActivities(response);
            } else {
                setActivities([]);
                setError("Unable to load login activity.");
            }
        } catch (err) {
            console.error("Login activity error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load login activity.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // =========================================================
    // FILTER
    // =========================================================

    const filteredActivities = activities.filter((activity) => {
        if (filter === "SUCCESS") {
            return activity.successful;
        }

        if (filter === "FAILED") {
            return !activity.successful;
        }

        return true;
    });

    const successfulCount = activities.filter(
        (activity) => activity.successful,
    ).length;

    const failedCount = activities.length - successfulCount;

    // =========================================================
    // ACCESS
    // =========================================================

    if (!isAdmin) {
        return (
            <section className="sv-page-stack">
                <div className="sv-empty-state large">
                    <span className="sv-empty-icon" aria-hidden="true">
                        <Icon name="lock" size={22} />
                    </span>
                    <div>
                        <h2>Administrator access required</h2>
                        <p>
                            Login activity is available to administrators.
                        </p>
                    </div>
                </div>
            </section>
        );
    }

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <section className="sv-page-stack">
                <header className="sv-page-header">
                    <div>
                        <span className="sv-eyebrow">Security operations</span>
                        <h1>Login Activity</h1>
                        <p>Loading authentication events…</p>
                    </div>
                </header>

                <div className="sv-loading-panel" role="status">
                    <span className="sv-loading-bar" aria-hidden="true" />
                    Loading login activity…
                </div>
            </section>
        );
    }

    return (
        <section className="sv-page-stack">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Security operations</span>
                    <h1>Login Activity</h1>
                    <p>
                        Recent authentication events for your account, with
                        risk classification and device context.
                    </p>
                </div>

                <div className="sv-header-actions">
                    <span className="sv-status-chip neutral">
                        {activities.length} events
                    </span>

                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadActivity(false)}
                        disabled={refreshing}
                    >
                        <Icon name="refresh" size={16} />
                        {refreshing ? "Refreshing…" : "Refresh"}
                    </button>
                </div>
            </header>

            {error && (
                <div className="sv-inline-error" role="alert">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadActivity()}
                    >
                        Try again
                    </button>
                </div>
            )}

            <div className="sv-stat-row">
                <div className="sv-stat-card">
                    <span className="sv-stat-icon" aria-hidden="true">
                        <Icon name="activity" size={17} />
                    </span>
                    <div className="sv-stat-copy">
                        <span>Total events</span>
                        <strong>{activities.length}</strong>
                        <small>Recorded authentication attempts</small>
                    </div>
                </div>

                <div className="sv-stat-card is-positive">
                    <span className="sv-stat-icon" aria-hidden="true">
                        <Icon name="check" size={17} />
                    </span>
                    <div className="sv-stat-copy">
                        <span>Successful</span>
                        <strong>{successfulCount}</strong>
                        <small>Completed sign-ins</small>
                    </div>
                </div>

                <div
                    className={`sv-stat-card ${failedCount > 0 ? "is-warning" : ""}`}
                >
                    <span className="sv-stat-icon" aria-hidden="true">
                        <Icon name="warning" size={17} />
                    </span>
                    <div className="sv-stat-copy">
                        <span>Failed</span>
                        <strong>{failedCount}</strong>
                        <small>Rejected authentication attempts</small>
                    </div>
                </div>
            </div>

            <div
                className="sv-filter-row"
                role="group"
                aria-label="Filter login activity"
            >
                <button
                    type="button"
                    className={`sv-filter-button ${filter === "ALL" ? "is-active" : ""}`}
                    onClick={() => setFilter("ALL")}
                    aria-pressed={filter === "ALL"}
                >
                    All
                    <strong>{activities.length}</strong>
                </button>

                <button
                    type="button"
                    className={`sv-filter-button ${filter === "SUCCESS" ? "is-active" : ""}`}
                    onClick={() => setFilter("SUCCESS")}
                    aria-pressed={filter === "SUCCESS"}
                >
                    Successful
                    <strong>{successfulCount}</strong>
                </button>

                <button
                    type="button"
                    className={`sv-filter-button ${filter === "FAILED" ? "is-active" : ""}`}
                    onClick={() => setFilter("FAILED")}
                    aria-pressed={filter === "FAILED"}
                >
                    Failed
                    <strong>{failedCount}</strong>
                </button>
            </div>

            {filteredActivities.length === 0 ? (
                <div className="sv-empty-state large">
                    <span className="sv-empty-icon" aria-hidden="true">
                        <Icon name="clock" size={22} />
                    </span>
                    <div>
                        <h2>No login activity</h2>
                        <p>There are no matching authentication events.</p>
                    </div>
                </div>
            ) : (
                <div className="sv-activity-feed">
                    {filteredActivities.map((activity, index) => {
                        const successful = Boolean(activity.successful);

                        const eventName = activity.eventType
                            ? activity.eventType.replaceAll("_", " ")
                            : successful
                              ? "Successful Login"
                              : "Failed Login";

                        const risk = activity.riskLevel || "UNKNOWN";

                        return (
                            <article
                                className="sv-activity-feed-row"
                                key={
                                    activity.id ||
                                    `${activity.timestamp}-${index}`
                                }
                            >
                                <span
                                    className={`sv-activity-state ${successful ? "success" : "failed"}`}
                                >
                                    {successful ? "Success" : "Failed"}
                                </span>

                                <div className="sv-activity-feed-copy">
                                    <h3>{eventName}</h3>
                                    <p>
                                        {activity.description ||
                                            "No description available."}
                                    </p>
                                    <small>
                                        Device:{" "}
                                        {activity.userAgent ||
                                            "Not recorded"}
                                    </small>
                                </div>

                                <div className="sv-activity-meta">
                                    <div>
                                        <span>Risk</span>
                                        <strong
                                            className={`sv-risk-text ${risk.toLowerCase()}`}
                                        >
                                            {risk}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>IP address</span>
                                        <strong>
                                            {activity.ipAddress ||
                                                "Not recorded"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Time</span>
                                        <strong>
                                            {activity.timestamp
                                                ? new Date(
                                                      activity.timestamp,
                                                  ).toLocaleString()
                                                : "Not recorded"}
                                        </strong>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default LoginActivity;
