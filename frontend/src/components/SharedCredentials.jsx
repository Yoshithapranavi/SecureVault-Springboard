import { useEffect, useState } from "react";

import {
    getSharedWithMe,
} from "../services/shareService";

import CredentialEditModal from "./CredentialEditModal";
import PasswordDisplay from "./PasswordDisplay";


function SharedCredentials({ userId }) {

    const [credentials, setCredentials] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [selectedCredential, setSelectedCredential] =
        useState(null);

    const [editCredentialId, setEditCredentialId] =
        useState(null);

    // =========================================================
    // LOAD SHARED CREDENTIALS
    // =========================================================

    useEffect(() => {

        if (!userId) {
            return;
        }

        loadSharedCredentials();

    }, [userId]);


    const loadSharedCredentials = async (
        showFullLoading = true
    ) => {

        try {

            if (showFullLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response =
                await getSharedWithMe(userId);

            if (response?.success) {

                setCredentials(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to load shared credentials."
                );
            }

        } catch (err) {

            console.error(
                "Shared credentials error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load shared credentials."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    // =========================================================
    // VIEW
    // =========================================================

    const handleView = (
        credential
    ) => {

        setSelectedCredential(
            credential
        );
    };


    // =========================================================
    // CLOSE VIEW
    // =========================================================

    const handleCloseView = () => {

        setSelectedCredential(null);
    };


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = (
        credential
    ) => {

        /*
         * Only EDIT permission can modify
         * a shared credential.
         */

        if (
            credential.permission !==
            "EDIT"
        ) {
            return;
        }

        setEditCredentialId(
            credential.credentialId
        );
    };


    // =========================================================
    // CLOSE EDIT
    // =========================================================

    const handleCloseEdit = () => {

        setEditCredentialId(null);
    };


    // =========================================================
    // AFTER UPDATE
    // =========================================================

    const handleUpdated = async () => {

        setEditCredentialId(null);

        await loadSharedCredentials(false);
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <section className="shared-credentials-section">

                <div className="shared-header">

                    <div>

                        <span className="eyebrow">
                            SHARING
                        </span>

                        <h2>
                            Shared With Me
                        </h2>

                        <p>
                            Credentials shared with your account
                        </p>

                    </div>

                </div>


                <div className="page-loading">
                    Loading shared credentials...
                </div>

            </section>
        );
    }


    return (

        <section className="shared-credentials-section">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="shared-header">

                <div>

                    <span className="eyebrow">
                        SHARING
                    </span>

                    <h2>
                        Shared With Me
                    </h2>

                    <p>
                        Credentials other users have shared
                        with your account.
                    </p>

                </div>


                <div className="shared-header-actions">

                    <span className="shared-count">

                        {credentials.length}

                        <span>
                            {" "}
                            {credentials.length === 1
                                ? "credential"
                                : "credentials"}
                        </span>

                    </span>


                    <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                            loadSharedCredentials(false)
                        }
                        disabled={refreshing}
                    >
                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>

                </div>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="error-message">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                            loadSharedCredentials(false)
                        }
                        disabled={refreshing}
                    >
                        Try again
                    </button>

                </div>

            )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!error &&
                credentials.length === 0 && (

                    <div className="empty-shared">

                        <div className="empty-state-icon">
                            ↗
                        </div>

                        <h3>
                            Nothing shared with you yet
                        </h3>

                        <p>
                            Credentials shared with your
                            account will appear here.
                        </p>

                    </div>

                )}


            {/* =================================================
                SHARED CREDENTIAL CARDS
            ================================================= */}

            {credentials.length > 0 && (

                <div className="shared-credentials-list">

                    {credentials.map(
                        (credential) => {

                            const isEdit =
                                credential.permission ===
                                "EDIT";


                            return (

                                <div
                                    className="shared-credential-card"
                                    key={
                                        credential.shareId
                                    }
                                >


                                    {/* =============================
                                        CARD HEADER
                                    ============================== */}

                                    <div className="shared-card-header">

                                        <div>

                                            <h3>
                                                {credential.title}
                                            </h3>

                                            <span>
                                                Shared by{" "}
                                                {credential.ownerEmail}
                                            </span>

                                        </div>


                                        <span
                                            className={
                                                isEdit
                                                    ? "permission-edit"
                                                    : "permission-read"
                                            }
                                        >
                                            {isEdit
                                                ? "EDIT"
                                                : "READ"}
                                        </span>

                                    </div>


                                    {/* =============================
                                        USERNAME
                                    ============================== */}

                                    <div className="shared-detail">

                                        <label>
                                            Username
                                        </label>

                                        <p>
                                            {credential.username}
                                        </p>

                                    </div>


                                    {/* =============================
                                        WEBSITE
                                    ============================== */}

                                    <div className="shared-detail">

                                        <label>
                                            Website
                                        </label>

                                        <p>
                                            {credential.websiteUrl ||
                                                "Not provided"}
                                        </p>

                                    </div>


                                    {/* =============================
                                        PERMISSION INFO
                                    ============================== */}

                                    <div className="shared-permission-info">

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


                                    {/* =============================
                                        ACTIONS
                                    ============================== */}

                                    <div className="shared-card-actions">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleView(
                                                    credential
                                                )
                                            }
                                        >
                                            View
                                        </button>


                                        {isEdit && (

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleEdit(
                                                        credential
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                        )}

                                    </div>

                                </div>

                            );
                        }
                    )}

                </div>

            )}


            {/* =================================================
                VIEW MODAL
            ================================================= */}

            {selectedCredential && (

                <div className="modal-overlay">

                    <div className="credential-modal">

                        <div className="modal-header">

                            <div>

                                <span className="eyebrow">
                                    SHARED CREDENTIAL
                                </span>

                                <h2>
                                    {selectedCredential.title}
                                </h2>

                                <p>
                                    Shared by{" "}
                                    {selectedCredential.ownerEmail}
                                </p>

                            </div>


                            <button
                                className="modal-close"
                                type="button"
                                onClick={
                                    handleCloseView
                                }
                            >
                                ×
                            </button>

                        </div>


                        <div className="credential-details">


                            <div className="detail-group">

                                <label>
                                    Username
                                </label>

                                <p>
                                    {selectedCredential.username}
                                </p>

                            </div>


                            <div className="detail-group">

                                <label>
                                    Website
                                </label>

                                <p>
                                    {selectedCredential.websiteUrl ||
                                        "Not provided"}
                                </p>

                            </div>


                            <div className="detail-group">

                                <label>
                                    Permission
                                </label>

                                <p>
                                    {selectedCredential.permission ===
                                        "EDIT"
                                        ? "EDIT - View and modify"
                                        : "READ - View only"}
                                </p>

                            </div>


                            <div className="detail-group">

                                <label>
                                    Password
                                </label>

                                <PasswordDisplay
                                    value={selectedCredential.password || ""}
                                />

                            </div>

                        </div>


                        <div className="modal-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={
                                    handleCloseView
                                }
                            >
                                Close
                            </button>


                            {selectedCredential.permission ===
                                "EDIT" && (

                                    <button
                                        type="button"
                                        className="primary-button"
                                        onClick={() => {

                                            handleCloseView();

                                            handleEdit(
                                                selectedCredential
                                            );

                                        }}
                                    >
                                        Edit Credential
                                    </button>

                                )}

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {editCredentialId !== null && (

                <CredentialEditModal

                    credentialId={
                        editCredentialId
                    }

                    userId={
                        userId
                    }

                    onClose={
                        handleCloseEdit
                    }

                    onUpdated={
                        handleUpdated
                    }

                />

            )}

        </section>
    );
}


export default SharedCredentials;