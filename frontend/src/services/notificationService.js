import api from "./api";

// =========================================================
// GET ALL NOTIFICATIONS
// =========================================================

export const getNotifications = async () => {

    const response = await api.get(
        "/notifications"
    );

    return response.data;
};


// =========================================================
// GET UNREAD NOTIFICATION COUNT
// =========================================================

export const getUnreadNotificationCount = async () => {

    const response = await api.get(
        "/notifications/unread-count"
    );

    return response.data;
};


// =========================================================
// MARK NOTIFICATION AS READ
// =========================================================

export const markNotificationAsRead = async (
    notificationId
) => {

    const response = await api.put(
        `/notifications/${notificationId}/read`
    );

    return response.data;
};