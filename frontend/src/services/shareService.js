import axios from "axios";

const API_URL =
    `${import.meta.env.VITE_API_URL || "http://localhost:8081"}/api/share`;


const getAuthHeaders = () => {

    const token =
        localStorage.getItem(
            "securevault_token"
        );

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};


// =========================================================
// SHARE CREDENTIAL
// =========================================================

export const shareCredential = async (
    credentialId,
    sharedWithUserId,
    permission,
    expiresAt
) => {

    const response = await axios.post(
        API_URL,
        {
            credentialId,
            sharedWithUserId,
            permission,
            expiresAt: expiresAt || null,
        },
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};

// =========================================================
// GET CREDENTIALS SHARED WITH ME
// =========================================================

export const getSharedWithMe = async (
    userId
) => {

    const response = await axios.get(
        `${API_URL}/shared-with-me/${userId}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// GET SHARES FOR MY CREDENTIAL
// =========================================================

export const getCredentialShares = async (
    credentialId
) => {

    const response = await axios.get(
        `${API_URL}/credential/${credentialId}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// UPDATE SHARE PERMISSION
// =========================================================

export const updateSharePermission = async (
    shareId,
    permission
) => {

    const response = await axios.put(
        `${API_URL}/${shareId}/permission`,
        {
            permission,
        },
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// REVOKE SHARE
// =========================================================

export const revokeShare = async (
    shareId
) => {

    const response = await axios.delete(
        `${API_URL}/${shareId}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};
