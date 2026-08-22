import api from "./api";

// =========================================================
// GET DEVICES
// =========================================================

export const getDevices = async () => {

    const response = await api.get(
        "/devices"
    );

    return response.data;
};


// =========================================================
// REMOVE DEVICE
// =========================================================

export const removeDevice = async (
    deviceId
) => {

    const response = await api.delete(
        `/devices/${deviceId}`
    );

    return response.data;
};