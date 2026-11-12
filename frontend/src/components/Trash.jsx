import { useEffect, useState } from "react";

import {
    getDeletedCredentials,
    restoreCredential,
    permanentlyDeleteCredential,
} from "../services/vaultService";
import Icon from "./Icon";

function Trash({ userId, onChanged }) {
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        if (userId) {
            loadTrash();
        }
        // Trash is scoped to the authenticated user.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const loadTrash = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getDeletedCredentials();

            if (response.success) {
                setCredentials(response.data || []);
            } else {
                setError(response.message || "Unable to load trash.");
            }
        } catch (err) {
            console.error("Trash loading error:", err);

            setError(
                err.response?.data?.message || "Unable to load trash.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (credentialId) => {
        try {
            setActionLoading(credentialId);
            setError("");

            const response = await restoreCredential(credentialId);

            if (!response.success) {
                setError(
                    response.message || "Unable to restore credential.",
                );
                return;
            }

            await loadTrash();

            if (onChanged) {
                await onChanged();
            }
        } catch (err) {
            console.error("Restore error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to restore credential.",
            );
        } finally {
            setActionLoading(null);
        }
    };

    const handlePermanentDelete = async (credentialId) => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this credential? This action cannot be undone.",
        );

        if (!confirmed) {
            return;
        }

        try {
            setActionLoading(credentialId);
            setError("");

            const response = await permanentlyDeleteCredential(credentialId);

            if (!response.success) {
                setError(
                    response.message ||
                        "Unable to permanently delete credential.",
                );
                return;
            }

            await loadTrash();

            if (onChanged) {
                await onChanged();
            }
        } catch (err) {
            console.error("Permanent delete error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to permanently delete credential.",
            );
        } finally {
            setActionLoading(null);
        }
    };

    if (loading) {
        return (
            <section className="sv-page-stack">
                <header className="sv-page-header">
                    <div>
                        <span className="sv-eyebrow">Workspace</span>
                        <h1>Trash</h1>
                        <p>Loading deleted credentials…</p>
                    </div>
                </header>

                <div className="sv-loading-panel" role="status">
                    <span className="sv-loading-bar" aria-hidden="true" />
                    Loading trash…
                </div>
            </section>
        );
    }

    return (
        <section className="sv-page-stack">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Workspace</span>
                    <h1>Trash</h1>
                    <p>
                        Deleted credentials are retained here until they are
                        restored or permanently removed.
                    </p>
                </div>

                <div className="sv-header-actions">
                    <span className="sv-status-chip neutral">
                        {credentials.length}{" "}
                        {credentials.length === 1 ? "item" : "items"}
                    </span>

                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={loadTrash}
                    >
                        <Icon name="refresh" size={16} />
                        Refresh
                    </button>
                </div>
            </header>

            {error && (
                <div className="sv-error-panel" role="alert">
                    <div className="sv-error-icon" aria-hidden="true">
                        <Icon name="warning" />
                    </div>
                    <div>
                        <h2>Trash unavailable</h2>
                        <p>{error}</p>
                    </div>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={loadTrash}
                    >
                        Try again
                    </button>
                </div>
            )}

            {credentials.length === 0 ? (
                <div className="sv-empty-state large">
                    <span className="sv-empty-icon" aria-hidden="true">
                        <Icon name="trash" size={22} />
                    </span>
                    <div>
                        <h2>Trash is empty</h2>
                        <p>
                            Deleted credentials will appear here so they can be
                            restored if needed.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="sv-table-shell">
                    <div className="sv-table-header">
                        <span>Credential</span>
                        <span>Category</span>
                        <span>Website</span>
                        <span>Actions</span>
                    </div>

                    <div>
                        {credentials.map((credential) => (
                            <div
                                className="sv-trash-row"
                                key={credential.id}
                            >
                                <div className="sv-trash-copy">
                                    <strong>{credential.title}</strong>
                                    <span>
                                        {credential.username ||
                                            "No username recorded"}
                                    </span>
                                </div>

                                <span
                                    className={`sv-category-badge ${String(
                                        credential.category || "OTHER",
                                    ).toLowerCase()}`}
                                >
                                    {credential.category || "OTHER"}
                                </span>

                                <span className="sv-trash-site">
                                    {credential.websiteUrl || "No website"}
                                </span>

                                <div className="sv-trash-actions">
                                    <button
                                        type="button"
                                        className="sv-btn sv-btn-secondary"
                                        disabled={
                                            actionLoading === credential.id
                                        }
                                        onClick={() =>
                                            handleRestore(credential.id)
                                        }
                                    >
                                        {actionLoading === credential.id
                                            ? "Working…"
                                            : "Restore"}
                                    </button>

                                    <button
                                        type="button"
                                        className="sv-btn sv-btn-danger"
                                        disabled={
                                            actionLoading === credential.id
                                        }
                                        onClick={() =>
                                            handlePermanentDelete(credential.id)
                                        }
                                    >
                                        Delete permanently
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

export default Trash;
