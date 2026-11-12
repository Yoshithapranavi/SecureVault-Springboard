import { useEffect, useState } from "react";

import { getDevices, removeDevice } from "../services/deviceService";
import Icon from "./Icon";

function Devices() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        loadDevices();
        // Devices are loaded once for the mounted page.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadDevices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getDevices();

            if (response?.success) {
                setDevices(response.data || []);
            } else {
                setError(response?.message || "Unable to load devices.");
            }
        } catch (err) {
            console.error("Device loading error:", err);

            setError(
                err.response?.data?.message || "Unable to load devices.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (deviceId) => {
        const confirmed = window.confirm(
            "Remove this device from your account?",
        );

        if (!confirmed) {
            return;
        }

        try {
            setRemovingId(deviceId);
            setError("");

            const response = await removeDevice(deviceId);

            if (response?.success) {
                setDevices((current) =>
                    current.filter((device) => device.id !== deviceId),
                );
            } else {
                setError(response?.message || "Unable to remove device.");
            }
        } catch (err) {
            console.error("Remove device error:", err);

            setError(
                err.response?.data?.message || "Unable to remove device.",
            );
        } finally {
            setRemovingId(null);
        }
    };

    if (loading) {
        return (
            <section className="sv-page-stack">
                <header className="sv-page-header">
                    <div>
                        <span className="sv-eyebrow">Account</span>
                        <h1>Devices</h1>
                        <p>Loading registered devices…</p>
                    </div>
                </header>

                <div className="sv-loading-panel" role="status">
                    <span className="sv-loading-bar" aria-hidden="true" />
                    Loading devices…
                </div>
            </section>
        );
    }

    return (
        <section className="sv-page-stack">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Account</span>
                    <h1>Devices</h1>
                    <p>
                        Devices associated with your SecureVault account.
                        Remove a device if you no longer recognise it or no
                        longer use it to sign in.
                    </p>
                </div>

                <div className="sv-header-actions">
                    <span className="sv-status-chip neutral">
                        {devices.length}{" "}
                        {devices.length === 1 ? "device" : "devices"}
                    </span>

                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={loadDevices}
                    >
                        <Icon name="refresh" size={16} />
                        Refresh
                    </button>
                </div>
            </header>

            {error && (
                <div className="sv-inline-error" role="alert">
                    {error}
                </div>
            )}

            {devices.length === 0 ? (
                <div className="sv-empty-state large">
                    <span className="sv-empty-icon" aria-hidden="true">
                        <Icon name="monitor" size={22} />
                    </span>
                    <div>
                        <h2>No devices found</h2>
                        <p>
                            Devices will appear here after they are associated
                            with your account.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="sv-table-shell">
                    <div className="sv-table-toolbar">
                        <span className="sv-eyebrow" style={{ margin: 0 }}>
                            Registered devices
                        </span>
                        <span className="sv-toolbar-count">
                            {devices.length} total
                        </span>
                    </div>

                    <div>
                        {devices.map((device) => (
                            <div className="sv-device-row" key={device.id}>
                                <span
                                    className="sv-device-icon"
                                    aria-hidden="true"
                                >
                                    <Icon name="monitor" size={17} />
                                </span>

                                <div className="sv-device-copy">
                                    <strong>
                                        {device.deviceName ||
                                            "Unnamed device"}
                                    </strong>
                                    <span>
                                        {device.ipAddress
                                            ? `IP ${device.ipAddress}`
                                            : "IP address not recorded"}
                                    </span>
                                </div>

                                <div className="sv-device-meta">
                                    <span>Last login</span>
                                    <span>
                                        {device.lastLogin
                                            ? new Date(
                                                  device.lastLogin,
                                              ).toLocaleString()
                                            : "Not recorded"}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    className="sv-btn sv-btn-danger"
                                    disabled={removingId === device.id}
                                    onClick={() => handleRemove(device.id)}
                                >
                                    {removingId === device.id
                                        ? "Removing…"
                                        : "Remove"}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export default Devices;
