import { useEffect, useState } from "react";

import {
    getSecurityAlerts,
    resolveSecurityAlert,
} from "../services/adminService";


function SecurityAlerts() {

    const [alerts, setAlerts] =
        useState([]);

    const [filter, setFilter] =
        useState("ALL");

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [resolvingId, setResolvingId] =
        useState(null);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =========================================================
    // LOAD ALERTS
    // =========================================================

    useEffect(() => {

        loadAlerts();

    }, []);


    const loadAlerts = async (
        showLoading = true
    ) => {

        try {

            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response =
                await getSecurityAlerts();

            if (Array.isArray(response)) {

                setAlerts(response);

            } else {

                setAlerts([]);

                setError(
                    "Unable to load security alerts."
                );
            }

        } catch (err) {

            console.error(
                "Security alerts error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load security alerts."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    // =========================================================
    // RESOLVE
    // =========================================================

    const handleResolve = async (
        alertId
    ) => {

        try {

            setResolvingId(
                alertId
            );

            setError("");
            setSuccess("");

            const response =
                await resolveSecurityAlert(
                    alertId
                );

            setAlerts(
                previousAlerts =>
                    previousAlerts.map(
                        alert =>
                            alert.id === alertId
                                ? {
                                    ...alert,
                                    resolved: true
                                }
                                : alert
                    )
            );

            setSuccess(
                response ||
                "Security alert resolved successfully."
            );

        } catch (err) {

            console.error(
                "Resolve security alert error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to resolve security alert."
            );

        } finally {

            setResolvingId(null);
        }
    };


    // =========================================================
    // FILTER
    // =========================================================

    const filteredAlerts =
        alerts.filter(
            (alert) => {

                const risk =
                    alert.riskLevel
                        ?.toUpperCase();

                if (
                    filter === "UNRESOLVED"
                ) {

                    return !alert.resolved;
                }

                if (
                    filter === "HIGH"
                ) {

                    return risk === "HIGH";
                }

                if (
                    filter === "MEDIUM"
                ) {

                    return risk === "MEDIUM";
                }

                if (
                    filter === "LOW"
                ) {

                    return risk === "LOW";
                }

                return true;
            }
        );


    // =========================================================
    // COUNTS
    // =========================================================

    const unresolvedCount =
        alerts.filter(
            alert =>
                !alert.resolved
        ).length;

    const highCount =
        alerts.filter(
            alert =>
                alert.riskLevel
                    ?.toUpperCase() === "HIGH"
        ).length;

    const mediumCount =
        alerts.filter(
            alert =>
                alert.riskLevel
                    ?.toUpperCase() === "MEDIUM"
        ).length;

    const lowCount =
        alerts.filter(
            alert =>
                alert.riskLevel
                    ?.toUpperCase() === "LOW"
        ).length;


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <section className="content-page">

                <div className="page-loading">
                    Loading security alerts...
                </div>

            </section>
        );
    }


    return (

        <section className="content-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-heading">

                <div>

                    <span className="eyebrow">
                        SECURITY
                    </span>

                    <h1>
                        Security Alerts
                    </h1>

                    <p>
                        Monitor suspicious activity
                        and security events.
                    </p>

                </div>


                <button
                    type="button"
                    className="text-button"
                    onClick={() =>
                        loadAlerts(false)
                    }
                    disabled={refreshing}
                >
                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>


            {/* =================================================
                STATUS
            ================================================= */}

            <div className="alert-count">

                {unresolvedCount}{" "}
                unresolved
                {unresolvedCount === 1
                    ? " alert"
                    : " alerts"}

            </div>


            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (

                <div className="success-message">

                    {success}

                </div>

            )}


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="error-message">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                            loadAlerts()
                        }
                    >
                        Try again
                    </button>

                </div>

            )}


            {/* =================================================
                SUMMARY FILTERS
            ================================================= */}

            <div className="alert-summary-grid">


                <button
                    type="button"
                    className={
                        filter === "ALL"
                            ? "alert-filter-card active"
                            : "alert-filter-card"
                    }
                    onClick={() =>
                        setFilter("ALL")
                    }
                >

                    <span>
                        All Alerts
                    </span>

                    <strong>
                        {alerts.length}
                    </strong>

                </button>


                <button
                    type="button"
                    className={
                        filter === "UNRESOLVED"
                            ? "alert-filter-card active"
                            : "alert-filter-card"
                    }
                    onClick={() =>
                        setFilter("UNRESOLVED")
                    }
                >

                    <span>
                        Unresolved
                    </span>

                    <strong>
                        {unresolvedCount}
                    </strong>

                </button>


                <button
                    type="button"
                    className={
                        filter === "HIGH"
                            ? "alert-filter-card active high"
                            : "alert-filter-card high"
                    }
                    onClick={() =>
                        setFilter("HIGH")
                    }
                >

                    <span>
                        High Risk
                    </span>

                    <strong>
                        {highCount}
                    </strong>

                </button>


                <button
                    type="button"
                    className={
                        filter === "MEDIUM"
                            ? "alert-filter-card active medium"
                            : "alert-filter-card medium"
                    }
                    onClick={() =>
                        setFilter("MEDIUM")
                    }
                >

                    <span>
                        Medium Risk
                    </span>

                    <strong>
                        {mediumCount}
                    </strong>

                </button>


                <button
                    type="button"
                    className={
                        filter === "LOW"
                            ? "alert-filter-card active low"
                            : "alert-filter-card low"
                    }
                    onClick={() =>
                        setFilter("LOW")
                    }
                >

                    <span>
                        Low Risk
                    </span>

                    <strong>
                        {lowCount}
                    </strong>

                </button>

            </div>


            {/* =================================================
                ALERT LIST
            ================================================= */}

            {filteredAlerts.length === 0 ? (

                <div className="empty-state">

                    <h3>
                        No alerts found
                    </h3>

                    <p>
                        There are no security alerts
                        matching this filter.
                    </p>

                </div>

            ) : (

                <div className="security-alert-list">

                    {filteredAlerts.map(
                        (alert) => {

                            const risk =
                                alert.riskLevel
                                    ?.toUpperCase() ||
                                "UNKNOWN";


                            const alertType =
                                alert.alertType
                                    ?.replaceAll(
                                        "_",
                                        " "
                                    ) ||
                                "Security Alert";


                            return (

                                <div
                                    key={alert.id}
                                    className={
                                        alert.resolved
                                            ? "security-alert-card resolved"
                                            : "security-alert-card"
                                    }
                                >


                                    {/* TOP */}

                                    <div className="alert-card-top">

                                        <div className="alert-card-title">

                                            <span
                                                className={
                                                    `risk-badge ${risk.toLowerCase()}`
                                                }
                                            >
                                                {risk}
                                            </span>

                                            <h3>
                                                {alertType}
                                            </h3>

                                        </div>


                                        <span
                                            className={
                                                alert.resolved
                                                    ? "status-badge resolved-status"
                                                    : "status-badge unresolved-status"
                                            }
                                        >
                                            {alert.resolved
                                                ? "Resolved"
                                                : "Unresolved"}
                                        </span>

                                    </div>


                                    {/* MESSAGE */}

                                    <p className="alert-message">

                                        {alert.message ||
                                            "No additional information available."}

                                    </p>


                                    {/* DETAILS */}

                                    <div className="alert-details">

                                        <div>

                                            <span>
                                                User
                                            </span>

                                            <strong>
                                                {alert.email ||
                                                    "Not available"}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                User ID
                                            </span>

                                            <strong>
                                                {alert.userId
                                                    ? `#${alert.userId}`
                                                    : "Not available"}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Detected
                                            </span>

                                            <strong>
                                                {alert.timestamp
                                                    ? new Date(
                                                        alert.timestamp
                                                    ).toLocaleString()
                                                    : "Not recorded"}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* ACTION */}

                                    {!alert.resolved && (

                                        <div className="alert-card-actions">

                                            <button
                                                type="button"
                                                className="resolve-alert-button"
                                                disabled={
                                                    resolvingId ===
                                                    alert.id
                                                }
                                                onClick={() =>
                                                    handleResolve(
                                                        alert.id
                                                    )
                                                }
                                            >

                                                {resolvingId ===
                                                    alert.id
                                                    ? "Resolving..."
                                                    : "Mark as Resolved"}

                                            </button>

                                        </div>

                                    )}

                                </div>
                            );
                        }
                    )}

                </div>

            )}

        </section>
    );
}


export default SecurityAlerts;