import axios from "axios";

const API_URL =
    "http://13.51.80.0:8081/api/vault";

const getAuthHeaders = () => {

    const token =
        localStorage.getItem("securevault_token");

    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
};


// =========================================================
// GET ALL CREDENTIALS
// =========================================================

export const getCredentials = async () => {

    const response = await axios.get(
        `${API_URL}/all`,
        {
            params: {
                page: 0,
                size: 20,
                sortBy: "title",
                direction: "asc",
            },
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// GET ONE CREDENTIAL
// =========================================================

export const getCredential = async (
    credentialId
) => {

    const response = await axios.get(
        `${API_URL}/${credentialId}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// CREATE CREDENTIAL
// =========================================================

export const createCredential = async (
    credential
) => {

    const response = await axios.post(
        API_URL,
        credential,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// UPDATE CREDENTIAL
// =========================================================

export const updateCredential = async (
    credentialId,
    credential
) => {

    const response = await axios.put(
        `${API_URL}/${credentialId}`,
        credential,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// DELETE CREDENTIAL
// =========================================================

export const deleteCredential = async (
    credentialId
) => {

    const response = await axios.delete(
        `${API_URL}/${credentialId}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// SEARCH CREDENTIALS
// =========================================================

export const searchCredentials = async (
    keyword
) => {

    const response = await axios.get(
        `${API_URL}/search`,
        {
            params: {
                keyword,
            },
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// FILTER BY CATEGORY
// =========================================================

export const getCredentialsByCategory = async (
    category
) => {

    const response = await axios.get(
        API_URL,
        {
            params: {
                category,
            },
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// GET PASSWORD HEALTH
// =========================================================

export const getPasswordHealth = async () => {

    const response = await axios.get(
        `${API_URL}/password-health`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// TOGGLE FAVORITE
// =========================================================

export const toggleFavorite = async (
    credentialId
) => {

    const response = await axios.patch(
        `${API_URL}/${credentialId}/favorite`,
        {},
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// GET DELETED CREDENTIALS
// =========================================================

export const getDeletedCredentials = async () => {

    const response = await axios.get(
        `${API_URL}/trash`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// RESTORE CREDENTIAL
// =========================================================

export const restoreCredential = async (
    credentialId
) => {

    const response = await axios.put(
        `${API_URL}/restore/${credentialId}`,
        {},
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// PERMANENTLY DELETE CREDENTIAL
// =========================================================

export const permanentlyDeleteCredential = async (
    credentialId
) => {

    const response = await axios.delete(
        `${API_URL}/permanent/${credentialId}`,
        {
            headers: getAuthHeaders(),
        }
    );

    return response.data;
};


// =========================================================
// DOWNLOAD PASSWORD HEALTH PDF
// =========================================================

export const downloadPasswordHealthPdf = async () => {

    const response = await axios.get(
        `${API_URL}/password-health/pdf`,
        {
            headers: getAuthHeaders(),
            responseType: "blob",
        }
    );

    return response.data;
};


// =========================================================
// DOWNLOAD PASSWORD HEALTH EXCEL
// =========================================================

export const downloadPasswordHealthExcel = async () => {

    const response = await axios.get(
        `${API_URL}/password-health/excel`,
        {
            headers: getAuthHeaders(),
            responseType: "blob",
        }
    );

    return response.data;
};
