import { useEffect, useState } from "react";

import {
    getLoginActivity,
} from "../services/adminService";

import { useAuth } from "../context/AuthContext";


function LoginActivity() {

    const {
        user,
        isAdmin,
    } = useAuth();


    const [activities, setActivities] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [filter, setFilter] =
        useState("ALL");


    // =========================================================
    // LOAD
    // =========================================================

    useEffect(() => {

        if (
            !isAdmin ||
            !user?.email
        ) {

            setLoading(false);

            return;
        }

        loadActivity();

    }, [
        isAdmin,
        user?.email
    ]);


    const loadActivity = async (
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
                await getLoginActivity(
                    user.email
                );

            if (Array.isArray(response)) {

                setActivities(response);

            } else {

                setActivities([]);

                setError(
                    "Unable to load login activity."
                );
            }

        } catch (err) {

            console.error(
                "Login activity error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load login activity."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    // =========================================================
    // FILTER
    // =========================================================

    const filteredActivities =
        activities.filter(
            (activity) => {

                if (
                    filter === "SUCCESS"
                ) {

                    return activity.successful;
                }

                if (
                    filter === "FAILED"
                ) {

                    return !activity.successful;
                }

                return true;
            }
        );


    const successfulCount =
        activities.filter(
            activity =>
                activity.successful
        ).length;


    const failedCount =
        activities.length -
        successfulCount;


    // =========================================================
    // ACCESS
    // =========================================================

    if (!isAdmin) {

        return (

            <section className="content-page">

                <div className="empty-state">

                    <h2>
                        Login Activity
                    </h2>

                    <p>
                        Login activity is available
                        to administrators.
                    </p>

                </div>

            </section>
        );
    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <section className="content-page">

                <div className="page-loading">
                    Loading login activity...
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
                        Login Activity
                    </h1>

                    <p>
                        Review recent authentication
                        activity for your account.
                    </p>

                </div>


                <button
                    type="button"
                    className="text-button"
                    onClick={() =>
                        loadActivity(false)
                    }
                    disabled={refreshing}
                >
                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>


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
                            loadActivity()
                        }
                    >
                        Try again
                    </button>

                </div>

            )}


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="activity-summary">

                <div>

                    <span>
                        Total
                    </span>

                    <strong>
                        {activities.length}
                    </strong>

                </div>


                <div>

                    <span>
                        Successful
                    </span>

                    <strong>
                        {successfulCount}
                    </strong>

                </div>


                <div>

                    <span>
                        Failed
                    </span>

                    <strong>
                        {failedCount}
                    </strong>

                </div>

            </div>


            {/* =================================================
                FILTER
            ================================================= */}

            <div className="activity-toolbar">

                <button
                    type="button"
                    className={
                        filter === "ALL"
                            ? "filter-button active"
                            : "filter-button"
                    }
                    onClick={() =>
                        setFilter("ALL")
                    }
                >
                    All
                </button>


                <button
                    type="button"
                    className={
                        filter === "SUCCESS"
                            ? "filter-button active"
                            : "filter-button"
                    }
                    onClick={() =>
                        setFilter("SUCCESS")
                    }
                >
                    Successful
                </button>


                <button
                    type="button"
                    className={
                        filter === "FAILED"
                            ? "filter-button active"
                            : "filter-button"
                    }
                    onClick={() =>
                        setFilter("FAILED")
                    }
                >
                    Failed
                </button>

            </div>


            {/* =================================================
                ACTIVITY LIST
            ================================================= */}

            {filteredActivities.length === 0 ? (

                <div className="empty-state">

                    <h3>
                        No login activity
                    </h3>

                    <p>
                        There are no matching
                        authentication events.
                    </p>

                </div>

            ) : (

                <div className="login-activity-list">

                    {filteredActivities.map(
                        (
                            activity,
                            index
                        ) => {

                            const successful =
                                Boolean(
                                    activity.successful
                                );

                            const eventName =
                                activity.eventType
                                    ? activity.eventType
                                        .replaceAll(
                                            "_",
                                            " "
                                        )
                                    : successful
                                        ? "Successful Login"
                                        : "Failed Login";


                            const risk =
                                activity.riskLevel ||
                                "UNKNOWN";


                            return (

                                <article
                                    className="login-activity-card"
                                    key={
                                        activity.id ||
                                        `${activity.timestamp}-${index}`
                                    }
                                >


                                    {/* STATUS */}

                                    <div className="activity-status">

                                        <span
                                            className={
                                                successful
                                                    ? "activity-dot success"
                                                    : "activity-dot failed"
                                            }
                                        />

                                        <strong>
                                            {successful
                                                ? "Successful Login"
                                                : "Failed Login"}
                                        </strong>

                                    </div>


                                    {/* MAIN */}

                                    <div className="activity-main">

                                        <h3>
                                            {eventName}
                                        </h3>

                                        <p>
                                            {activity.description ||
                                                "No description available."}
                                        </p>

                                    </div>


                                    {/* META */}

                                    <div className="activity-meta">

                                        <div>

                                            <span>
                                                Risk
                                            </span>

                                            <strong
                                                className={
                                                    `risk-text ${risk.toLowerCase()}`
                                                }
                                            >
                                                {risk}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                IP Address
                                            </span>

                                            <strong>
                                                {activity.ipAddress ||
                                                    "Not recorded"}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Time
                                            </span>

                                            <strong>
                                                {activity.timestamp
                                                    ? new Date(
                                                        activity.timestamp
                                                    ).toLocaleString()
                                                    : "Not recorded"}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* DEVICE */}

                                    <div className="activity-user-agent">

                                        <span>
                                            Device
                                        </span>

                                        <p>
                                            {activity.userAgent ||
                                                "Not recorded"}
                                        </p>

                                    </div>

                                </article>
                            );
                        }
                    )}

                </div>

            )}

        </section>
    );
}


export default LoginActivity;