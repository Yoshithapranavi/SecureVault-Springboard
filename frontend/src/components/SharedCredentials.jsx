import { useEffect, useState } from "react";

import { getSharedWithMe } from "../services/shareService";

import CredentialEditModal from "./CredentialEditModal";
import PasswordDisplay from "./PasswordDisplay";
import Icon from "./Icon";

function SharedCredentials({ userId }) {
    const [credentials, setCredentials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [selectedCredential, setSelectedCredential] = useState(null);
    const [editCredentialId, setEditCredentialId] = useState(null);

    useEffect(() => {
        if (!userId) {
            return;
        }

        loadSharedCredentials();
        // Sharing is loaded when the authenticated user changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    const loadSharedCredentials = async (showFullLoading = true) => {
        try {
            if (showFullLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response = await getSharedWithMe(userId);

            if (response?.success) {
                setCredentials(
                    Array.isArray(response.data) ? response.data : [],
                );
            } else {
                setError(
                    response?.message ||
                        "Unable to load shared credentials.",
                );
            }
        } catch (err) {
            console.error("Shared credentials error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to load shared credentials.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleView = (credential) => {
        setSelectedCredential(credential);
    };

    const handleCloseView = () => {
        setSelectedCredential(null);
    };

    const handleEdit = (credential) => {
        if (credential.permission !== "EDIT") {
            return;
        }

        setEditCredentialId(credential.credentialId);
    };

    const handleCloseEdit = () => {
        setEditCredentialId(null);
    };

    const handleUpdated = async () => {
        setEditCredentialId(null);
        await loadSharedCredentials(false);
    };

    if (loading) {
        return (
            <section className="sv-page-stack">
                <header className="sv-page-header">
                    <div>
                        <span className="sv-eyebrow">Sharing</span>
                        <h1>Shared With Me</h1>
                        <p>Loading credentials shared with your account…</p>
                    </div>
                </header>

                <div className="sv-loading-panel" role="status">
                    <span className="sv-loading-bar" aria-hidden="true" />
                    Loading shared credentials…
                </div>
            </section>
        );
    }

    return (
        <section className="sv-page-stack">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Sharing</span>
                    <h1>Shared With Me</h1>
                    <p>
                        Credentials other SecureVault users have shared with
                        your account, including the access level they granted.
                    </p>
                </div>

                <div className="sv-header-actions">
                    <span className="sv-status-chip neutral">
                        {credentials.length}{" "}
                        {credentials.length === 1
                            ? "credential"
                            : "credentials"}
                    </span>

                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadSharedCredentials(false)}
                        disabled={refreshing}
                    >
                        <Icon name="refresh" size={16} />
                        {refreshing ? "Refreshing…" : "Refresh"}
                    </button>
                </div>
            </header>

            {error && (
                <div className="sv-error-panel" role="alert">
                    <div className="sv-error-icon" aria-hidden="true">
                        <Icon name="warning" />
                    </div>
                    <div>
                        <h2>Shared credentials unavailable</h2>
                        <p>{error}</p>
                    </div>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadSharedCredentials(false)}
                        disabled={refreshing}
                    >
                        Try again
                    </button>
                </div>
            )}

            {!error && credentials.length === 0 && (
                <div className="sv-empty-state large">
                    <span className="sv-empty-icon" aria-hidden="true">
                        <Icon name="shared" size={22} />
                    </span>
                    <div>
                        <h2>Nothing shared with you yet</h2>
                        <p>
                            When another user shares a credential, it will
                            appear here with the permission they granted.
                        </p>
                    </div>
                </div>
            )}

            {credentials.length > 0 && (
                <div className="sv-shared-grid">
                    {credentials.map((credential) => {
                        const isEdit = credential.permission === "EDIT";

                        return (
                            <article
                                className="sv-shared-card"
                                key={credential.shareId}
                            >
                                <div className="sv-shared-card-head">
                                    <div>
                                        <h3>{credential.title}</h3>
                                        <p>
                                            Shared by{" "}
                                            {credential.ownerEmail ||
                                                "another user"}
                                        </p>
                                    </div>

                                    <span
                                        className={`sv-status-chip ${
                                            isEdit ? "neutral" : "positive"
                                        }`}
                                    >
                                        {isEdit ? "Edit access" : "View only"}
                                    </span>
                                </div>

                                <div className="sv-shared-meta">
                                    <div>
                                        <span>Username</span>
                                        <strong>
                                            {credential.username || "—"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Website</span>
                                        <strong>
                                            {credential.websiteUrl ||
                                                "Not provided"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Permission</span>
                                        <strong>
                                            {isEdit ? "EDIT" : "READ"}
                                        </strong>
                                    </div>
                                </div>

                                <div className="sv-shared-permission">
                                    <strong>
                                        {isEdit
                                            ? "Edit access"
                                            : "View-only access"}
                                    </strong>
                                    <span>
                                        {isEdit
                                            ? "You can view and modify this credential."
                                            : "You can view this credential but cannot modify it."}
                                    </span>
                                </div>

                                <div className="sv-shared-actions">
                                    <button
                                        type="button"
                                        className="sv-btn sv-btn-secondary"
                                        onClick={() => handleView(credential)}
                                    >
                                        <Icon name="eye" size={15} />
                                        View
                                    </button>

                                    {isEdit && (
                                        <button
                                            type="button"
                                            className="sv-btn sv-btn-primary"
                                            onClick={() => handleEdit(credential)}
                                        >
                                            <Icon name="edit" size={15} />
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {selectedCredential && (
                <div className="modal-overlay" onClick={handleCloseView}>
                    <div
                        className="credential-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="shared-credential-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="modal-header">
                            <div>
                                <span className="sv-eyebrow">
                                    Shared credential
                                </span>
                                <h2 id="shared-credential-title">
                                    {selectedCredential.title}
                                </h2>
                                <p>
                                    Shared by{" "}
                                    {selectedCredential.ownerEmail ||
                                        "another user"}
                                </p>
                            </div>

                            <button
                                className="modal-close"
                                type="button"
                                onClick={handleCloseView}
                                aria-label="Close credential"
                            >
                                ×
                            </button>
                        </div>

                        <div className="credential-details">
                            <div className="detail-group">
                                <label>Username</label>
                                <p>{selectedCredential.username || "—"}</p>
                            </div>

                            <div className="detail-group">
                                <label>Website</label>
                                <p>
                                    {selectedCredential.websiteUrl ||
                                        "Not provided"}
                                </p>
                            </div>

                            <div className="detail-group">
                                <label>Permission</label>
                                <p>
                                    {selectedCredential.permission === "EDIT"
                                        ? "EDIT — view and modify"
                                        : "READ — view only"}
                                </p>
                            </div>

                            <div className="detail-group">
                                <label>Password</label>
                                <PasswordDisplay
                                    value={selectedCredential.password || ""}
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={handleCloseView}
                            >
                                Close
                            </button>

                            {selectedCredential.permission === "EDIT" && (
                                <button
                                    type="button"
                                    className="primary-button"
                                    onClick={() => {
                                        handleCloseView();
                                        handleEdit(selectedCredential);
                                    }}
                                >
                                    Edit credential
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {editCredentialId !== null && (
                <CredentialEditModal
                    credentialId={editCredentialId}
                    userId={userId}
                    onClose={handleCloseEdit}
                    onUpdated={handleUpdated}
                />
            )}
        </section>
    );
}

export default SharedCredentials;
