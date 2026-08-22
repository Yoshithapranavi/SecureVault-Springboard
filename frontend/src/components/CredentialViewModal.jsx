import { useEffect, useState } from "react";
import { getCredential } from "../services/vaultService";
import PasswordDisplay from "./PasswordDisplay";

function CredentialViewModal({
    credentialId,
    userId,
    onClose,
}) {

    const [credential, setCredential] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================================
    // LOAD CREDENTIAL
    // =========================================================

    useEffect(() => {

        loadCredential();

    }, [credentialId, userId]);


    const loadCredential = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getCredential(
                    credentialId,
                    userId
                );

            if (response.success) {

                setCredential(
                    response.data
                );

            } else {

                setError(
                    response.message ||
                    "Unable to retrieve credential."
                );
            }

        } catch (err) {

            console.error(
                "View credential error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to retrieve credential."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div
            className="modal-overlay"
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            <div
                className="credential-modal view-credential-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="modal-header">

                    <div className="modal-title-row">

                        <span className="modal-security-icon">
                            🔐
                        </span>

                        <div>

                            <h2>
                                {credential?.title ||
                                    "Credential"}
                            </h2>

                            {credential?.category && (

                                <span className="view-category-badge">
                                    {credential.category}
                                </span>

                            )}

                        </div>

                    </div>


                    <button
                        className="modal-close"
                        onClick={onClose}
                        type="button"
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="view-modal-loading">

                        <div className="loading-spinner">
                            ⟳
                        </div>

                        <p>
                            Loading credential...
                        </p>

                    </div>

                )}


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="view-modal-body">

                        <div className="error-message">
                            {error}
                        </div>

                    </div>

                )}


                {/* =================================================
                    DETAILS
                ================================================= */}

                {credential &&
                    !loading &&
                    !error && (

                        <div className="credential-details">


                            {/* USERNAME */}

                            <div className="detail-group">

                                <label>
                                    Username
                                </label>

                                <div className="detail-value">
                                    {credential.username ||
                                        "Not provided"}
                                </div>

                            </div>


                            {/* PASSWORD */}

                            <div className="detail-group">

                                <label>
                                    Password
                                </label>
                                <PasswordDisplay
                                    value={credential.password || ""}
                                />

                                <span className="form-hint">
                                    Password is hidden by default.
                                </span>

                            </div>


                            {/* WEBSITE */}

                            <div className="detail-group">

                                <label>
                                    Website
                                </label>

                                {credential.websiteUrl ? (

                                    <a
                                        href={
                                            credential.websiteUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="detail-link"
                                    >
                                        {credential.websiteUrl}
                                    </a>

                                ) : (

                                    <div className="detail-value muted">
                                        Not provided
                                    </div>

                                )}

                            </div>


                            {/* NOTES */}

                            <div className="detail-group">

                                <label>
                                    Secure Notes
                                </label>

                                <div className="detail-value notes-value">

                                    {credential.notes ||
                                        "No notes added."}

                                </div>

                            </div>

                        </div>

                    )}


                {/* =================================================
                    FOOTER
                ================================================= */}

                <div className="modal-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onClose}
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
}

export default CredentialViewModal;