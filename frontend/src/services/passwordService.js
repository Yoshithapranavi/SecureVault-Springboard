import api from "./api";


// =========================================================
// PASSWORD STRENGTH
// =========================================================

export const checkPasswordStrength = async (
    password
) => {

    const response = await api.post(
        "/password/strength",
        {
            password,
        }
    );

    return response.data;
};


// =========================================================
// PASSWORD GENERATOR
// =========================================================

export const generatePassword = async (
    settings
) => {

    const response = await api.post(
        "/password/generate",
        settings
    );

    return response.data;
};