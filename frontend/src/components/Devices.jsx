import { useEffect, useState } from "react";

import {
    getDevices,
    removeDevice,
} from "../services/deviceService";

function Devices() {

    const [devices, setDevices] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [removingId, setRemovingId] =
        useState(null);


    // =========================================================
    // LOAD DEVICES
    // =========================================================

    useEffect(() => {

        loadDevices();

    }, []);


    const loadDevices = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getDevices();

            if (response?.success) {

                setDevices(
                    response.data || []
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to load devices."
                );
            }

        } catch (err) {

            console.error(
                "Device loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load devices."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // REMOVE DEVICE
    // =========================================================

    const handleRemove = async (
        deviceId
    ) => {

        const confirmed =
            window.confirm(
                "Remove this device from your account?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setRemovingId(deviceId);
            setError("");

            const response =
                await removeDevice(
                    deviceId
                );

            if (response?.success) {

                setDevices(
                    (current) =>
                        current.filter(
                            (device) =>
                                device.id !==
                                deviceId
                        )
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to remove device."
                );
            }

        } catch (err) {

            console.error(
                "Remove device error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to remove device."
            );

        } finally {

            setRemovingId(null);
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (
            <section className="content-page">

                <div className="page-loading">
                    Loading devices...
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
                        SECURITY
                    </span>

                    <h1>
                        Devices
                    </h1>

                    <p>
                        Review devices associated
                        with your SecureVault account.
                    </p>

                </div>
                <button
                    type="button"
                    className="text-button"
                    onClick={loadDevices}
                    disabled={loading}
                >
                    Refresh
                </button>

            </div>


            {error && (

                <div className="error-message">
                    {error}
                </div>

            )}


            {devices.length === 0 ? (

                <div className="empty-state">

                    <h2>
                        No devices found
                    </h2>

                    <p>
                        There are no registered
                        devices for your account.
                    </p>

                </div>

            ) : (

                <div className="devices-list">

                    {devices.map(
                        (device) => (

                            <div
                                className="device-card"
                                key={device.id}
                            >

                                <div className="device-icon">
                                    ▣
                                </div>


                                <div className="device-info">

                                    <h3>
                                        {device.deviceName || "Unknown Device"}
                                    </h3>

                                    {device.ipAddress && (
                                        <small>
                                            IP: {device.ipAddress}
                                        </small>
                                    )}


                                    {device.lastLogin && (

                                        <small>
                                            Last login:{" "}
                                            {new Date(
                                                device.lastLogin
                                            ).toLocaleString()}
                                        </small>

                                    )}

                                </div>


                                <button
                                    type="button"
                                    className="delete-confirm-button"
                                    disabled={
                                        removingId ===
                                        device.id
                                    }
                                    onClick={() =>
                                        handleRemove(
                                            device.id
                                        )
                                    }
                                >

                                    {removingId ===
                                        device.id
                                        ? "Removing..."
                                        : "Remove"}

                                </button>

                            </div>

                        )
                    )}

                </div>

            )}

        </section>
    );
}

export default Devices;