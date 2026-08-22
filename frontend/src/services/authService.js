import api from "./api";

export const registerUser = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

export const loginUser = async (loginData) => {
    const response = await api.post("/auth/login", loginData);
    return response.data;
};

export const verifyMfa = async (mfaData) => {
    const response = await api.post("/auth/mfa/verify", mfaData);
    return response.data;
};

export const logoutUser = async () => {
    const token = localStorage.getItem("securevault_token");

    const response = await api.post(
        "/auth/logout",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

export const getCurrentUser = async () => {
    const token = localStorage.getItem("securevault_token");

    const response = await api.get(
        "/auth/me",
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// =========================================================
// FORGOT PASSWORD
// =========================================================

export const forgotPassword = async (email) => {
    const response = await api.post(
        "/auth/password/forgot",
        {
            email,
        }
    );

    return response.data;
};

// =========================================================
// RESET PASSWORD
// =========================================================

export const resetPassword = async (token, password) => {
    const response = await api.post(
        "/auth/password/reset",
        {
            token,
            password,
        }
    );

    return response.data;
};