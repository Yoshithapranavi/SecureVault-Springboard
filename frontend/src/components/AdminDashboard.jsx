import { useEffect, useState } from "react";

import {
    getSecuritySummary,
} from "../services/adminService";

import { useAuth } from "../context/AuthContext";


function AdminDashboard({
    onNavigate,
}) {

    const { user } = useAuth();

    const [summary, setSummary] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================================================
    // LOAD SUMMARY
    // =========================================================

    useEffect(() => {

        loadSummary();

    }, []);


    const loadSummary = async (
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
                await getSecuritySummary();

            setSummary(
                response || {}
            );

        } catch (err) {

            console.error(
                "Admin dashboard error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load admin dashboard."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <section className="content-page">

                <div className="page-loading">
                    Loading admin dashboard...
                </div>

            </section>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (
            <section className="content-page">

                <div className="error-message">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                            loadSummary()
                        }
                    >
                        Try again
                    </button>

                </div>

            </section>
        );
    }


    // =========================================================
    // SAFE VALUES
    // =========================================================

    const totalEvents =
        Number(
            summary?.totalSecurityEvents
        ) || 0;

    const successfulLogins =
        Number(
            summary?.successfulLogins
        ) || 0;

    const failedLogins =
        Number(
            summary?.failedLogins
        ) || 0;

    const highRiskEvents =
        Number(
            summary?.highRiskEvents
        ) || 0;

    const mediumRiskEvents =
        Number(
            summary?.mediumRiskEvents
        ) || 0;

    const unresolvedAlerts =
        Number(
            summary?.unresolvedAlerts
        ) || 0;


    return (

        <section className="dashboard-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-heading">

                <div>

                    <span className="eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Monitor SecureVault security,
                        users and system activity.
                    </p>

                </div>


                <button
                    type="button"
                    className="text-button"
                    onClick={() =>
                        loadSummary(false)
                    }
                    disabled={refreshing}
                >
                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>


            {/* =================================================
                SECURITY SUMMARY
            ================================================= */}

            <div className="dashboard-stats">


                <div className="stat-card">

                    <span>
                        Security Events
                    </span>

                    <strong>
                        {totalEvents}
                    </strong>

                    <small>
                        Total recorded events
                    </small>

                </div>


                <div className="stat-card">

                    <span>
                        Successful Logins
                    </span>

                    <strong>
                        {successfulLogins}
                    </strong>

                    <small>
                        Successful authentication
                    </small>

                </div>


                <div className="stat-card">

                    <span>
                        Failed Logins
                    </span>

                    <strong>
                        {failedLogins}
                    </strong>

                    <small>
                        Failed authentication attempts
                    </small>

                </div>


                <div className="stat-card">

                    <span>
                        High Risk Events
                    </span>

                    <strong>
                        {highRiskEvents}
                    </strong>

                    <small>
                        Requires attention
                    </small>

                </div>


                <div className="stat-card">

                    <span>
                        Medium Risk Events
                    </span>

                    <strong>
                        {mediumRiskEvents}
                    </strong>

                    <small>
                        Security events
                    </small>

                </div>


                <div className="stat-card">

                    <span>
                        Unresolved Alerts
                    </span>

                    <strong>
                        {unresolvedAlerts}
                    </strong>

                    <small>
                        Alerts awaiting review
                    </small>

                </div>


                <div className="stat-card">

                    <span>
                        Account
                    </span>

                    <strong className="status-good">
                        ADMIN
                    </strong>

                    <small>
                        {user?.email || "Administrator"}
                    </small>

                </div>


                <div className="stat-card">

                    <span>
                        System Status
                    </span>

                    <strong className="status-good">
                        Protected
                    </strong>

                    <small>
                        Security monitoring active
                    </small>

                </div>

            </div>


            {/* =================================================
                ADMIN TOOLS
            ================================================= */}

            <div className="dashboard-grid">

                <div className="dashboard-panel">

                    <div className="panel-heading">

                        <div>

                            <h2>
                                Administration
                            </h2>

                            <p>
                                Manage SecureVault from
                                one place.
                            </p>

                        </div>

                    </div>


                    <div className="quick-actions">


                        <button
                            type="button"
                            onClick={() =>
                                onNavigate("users")
                            }
                        >

                            <strong>
                                User Management
                            </strong>

                            <span>
                                View and search registered users
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                onNavigate("security")
                            }
                        >

                            <strong>
                                Security Overview
                            </strong>

                            <span>
                                Review system security statistics
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                onNavigate("alerts")
                            }
                        >

                            <strong>
                                Security Alerts
                            </strong>

                            <span>
                                Review suspicious activity
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                onNavigate("activity")
                            }
                        >

                            <strong>
                                Login Activity
                            </strong>

                            <span>
                                Review authentication activity
                            </span>

                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                onNavigate("audit")
                            }
                        >

                            <strong>
                                Audit Logs
                            </strong>

                            <span>
                                Review credential and security operations
                            </span>

                        </button>

                    </div>

                </div>


                <div className="dashboard-panel dashboard-info-panel">

                    <span className="eyebrow">
                        SECUREVAULT ADMIN
                    </span>

                    <h2>
                        Security at a glance.
                    </h2>

                    <p>
                        Use the administration tools to
                        monitor users, authentication,
                        alerts and credential activity.
                    </p>


                    <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                            onNavigate(
                                unresolvedAlerts > 0
                                    ? "alerts"
                                    : "security"
                            )
                        }
                    >
                        {unresolvedAlerts > 0
                            ? "Review security alerts →"
                            : "Review security overview →"}
                    </button>

                </div>

            </div>

        </section>
    );
}


export default AdminDashboard;