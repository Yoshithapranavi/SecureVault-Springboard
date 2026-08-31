import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api`,
    headers: {
        "Content-Type": "application/json",
    },
});

// =========================================================
// JWT INTERCEPTOR
// =========================================================

api.interceptors.request.use(
    (config) => {

        // Authentication endpoints must NOT receive
        // an old/stale JWT.
        const publicAuthEndpoints = [
            "/auth/login",
            "/auth/register",
            "/auth/mfa/verify",
            "/auth/password/forgot",
            "/auth/password/reset",
        ];

        const isPublicAuthEndpoint =
            publicAuthEndpoints.some(
                (endpoint) => config.url?.startsWith(endpoint)
            );

        if (isPublicAuthEndpoint) {

            // Make sure an old Authorization header
            // is not accidentally sent.
            if (config.headers) {
                delete config.headers.Authorization;
            }

            return config;
        }

        // =====================================================
        // PROTECTED REQUESTS
        // =====================================================

        const token =
            localStorage.getItem("securevault_token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default api;