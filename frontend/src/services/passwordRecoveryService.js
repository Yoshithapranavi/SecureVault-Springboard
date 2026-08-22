import api from "./api";

// =========================================================
// FORGOT PASSWORD
// =========================================================

export const forgotPassword = async (
    email
) => {

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

export const resetPassword = async (
    token,
    password
) => {

    const response = await api.post(
        "/auth/password/reset",
        {
            token,
            password,
        }
    );

    return response.data;
};