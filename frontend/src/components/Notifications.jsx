import { useEffect, useState } from "react";

import {
    getNotifications,
    markNotificationAsRead,
} from "../services/notificationService";

function Notifications() {

    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================================
    // LOAD NOTIFICATIONS
    // =========================================================

    useEffect(() => {

        loadNotifications();

    }, []);


    const loadNotifications = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getNotifications();

            if (response?.success) {

                setNotifications(
                    response.data || []
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to load notifications."
                );
            }

        } catch (err) {

            console.error(
                "Notification loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load notifications."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // MARK AS READ
    // =========================================================

    const handleMarkAsRead = async (
        notificationId
    ) => {

        try {

            const response =
                await markNotificationAsRead(
                    notificationId
                );

            if (response?.success) {

                setNotifications(
                    (current) =>
                        current.map(
                            (notification) =>
                                notification.id ===
                                    notificationId
                                    ? {
                                        ...notification,
                                        status: "READ",
                                    }
                                    : notification
                        )
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to mark notification as read."
                );
            }

        } catch (err) {

            console.error(
                "Mark notification read error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to mark notification as read."
            );
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <section className="content-page">

                <div className="page-loading">
                    Loading notifications...
                </div>

            </section>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <section className="content-page">

            <div className="page-heading">

                <div>

                    <span className="eyebrow">
                        ACCOUNT
                    </span>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        Security and account activity
                        notifications.
                    </p>

                </div>

            </div>


            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {/* =================================================
                EMPTY STATE
            ================================================= */}

            {notifications.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        You're all caught up
                    </h2>

                    <p>
                        There are no notifications
                        to display.
                    </p>

                </div>

            ) : (

                <div className="notifications-list">

                    {notifications.map(
                        (notification) => {

                            const isRead =
                                notification.status ===
                                "READ";

                            return (

                                <div
                                    key={notification.id}
                                    className={
                                        `notification-card ${isRead
                                            ? "read"
                                            : "unread"
                                        }`
                                    }
                                >

                                    <div>

                                        <strong>
                                            {notification.title ||
                                                "Security Notification"}
                                        </strong>

                                        <p>
                                            {notification.message ||
                                                "No additional information."}
                                        </p>

                                        {notification.createdAt && (

                                            <small>
                                                {new Date(
                                                    notification.createdAt
                                                ).toLocaleString()}
                                            </small>

                                        )}

                                    </div>


                                    {!isRead && (

                                        <button
                                            type="button"
                                            className="text-button"
                                            onClick={() =>
                                                handleMarkAsRead(
                                                    notification.id
                                                )
                                            }
                                        >
                                            Mark as read
                                        </button>

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

export default Notifications;