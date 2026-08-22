import { useEffect, useState } from "react";

import {
    getDeletedCredentials,
    restoreCredential,
    permanentlyDeleteCredential,
} from "../services/vaultService";


function Trash({
    userId,
    onChanged,
}) {

    // =========================================================
    // STATE
    // =========================================================

    const [credentials, setCredentials] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(null);


    // =========================================================
    // LOAD TRASH
    // =========================================================

    useEffect(() => {

        if (userId) {

            loadTrash();

        }

    }, [userId]);


    // =========================================================
    // LOAD DELETED CREDENTIALS
    // =========================================================

    const loadTrash = async () => {

        try {

            setLoading(true);
            setError("");


            const response =
                await getDeletedCredentials();


            if (response.success) {

                setCredentials(
                    response.data || []
                );

            } else {

                setError(
                    response.message ||
                    "Unable to load trash."
                );
            }

        } catch (err) {

            console.error(
                "Trash loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load trash."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // RESTORE CREDENTIAL
    // =========================================================

    const handleRestore = async (
        credentialId
    ) => {

        try {

            setActionLoading(
                credentialId
            );

            setError("");


            const response =
                await restoreCredential(
                    credentialId
                );


            if (!response.success) {

                setError(
                    response.message ||
                    "Unable to restore credential."
                );

                return;
            }


            // -------------------------------------------------
            // Refresh Trash
            // -------------------------------------------------

            await loadTrash();


            // -------------------------------------------------
            // Refresh Vault
            // -------------------------------------------------

            if (onChanged) {

                await onChanged();

            }

        } catch (err) {

            console.error(
                "Restore error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to restore credential."
            );

        } finally {

            setActionLoading(null);
        }
    };


    // =========================================================
    // PERMANENT DELETE
    // =========================================================

    const handlePermanentDelete = async (
        credentialId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to permanently delete this credential? This action cannot be undone."
            );


        if (!confirmed) {

            return;
        }


        try {

            setActionLoading(
                credentialId
            );

            setError("");


            const response =
                await permanentlyDeleteCredential(
                    credentialId
                );


            if (!response.success) {

                setError(
                    response.message ||
                    "Unable to permanently delete credential."
                );

                return;
            }


            // -------------------------------------------------
            // Refresh Trash
            // -------------------------------------------------

            await loadTrash();


            // -------------------------------------------------
            // Refresh Vault
            // -------------------------------------------------

            if (onChanged) {

                await onChanged();

            }

        } catch (err) {

            console.error(
                "Permanent delete error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to permanently delete credential."
            );

        } finally {

            setActionLoading(null);
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <section className="trash-section">

                <div className="trash-header">

                    <div>

                        <h2>
                            Trash
                        </h2>

                        <p>
                            Loading deleted credentials...
                        </p>

                    </div>

                </div>

            </section>
        );
    }


    // =========================================================
    // UI
    // =========================================================

    return (

        <section className="trash-section">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="trash-header">

                <div>

                    <h2>
                        Trash
                    </h2>

                    <p>
                        Deleted credentials are kept here
                        until restored or permanently deleted.
                    </p>

                </div>


                <span className="trash-count">

                    {credentials.length}

                </span>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* =================================================
                EMPTY TRASH
            ================================================= */}

            {credentials.length === 0 ? (

                <div className="empty-trash">

                    <h3>
                        Trash is empty
                    </h3>

                    <p>
                        Deleted credentials will appear here.
                    </p>

                </div>

            ) : (


                /* =================================================
                   TRASH LIST
                ================================================= */

                <div className="trash-list">

                    {credentials.map(
                        (credential) => (

                            <div
                                className="trash-card"
                                key={credential.id}
                            >


                                {/* =================================
                                    CREDENTIAL INFO
                                ================================= */}

                                <div className="trash-card-info">

                                    <h3>
                                        {credential.title}
                                    </h3>


                                    <span>
                                        {credential.category}
                                    </span>


                                    <p>
                                        {credential.username}
                                    </p>


                                    <p>
                                        {credential.websiteUrl ||
                                            "No website provided"}
                                    </p>

                                </div>


                                {/* =================================
                                    ACTIONS
                                ================================= */}

                                <div className="trash-actions">


                                    {/* RESTORE */}

                                    <button
                                        type="button"
                                        disabled={
                                            actionLoading ===
                                            credential.id
                                        }
                                        onClick={() =>
                                            handleRestore(
                                                credential.id
                                            )
                                        }
                                    >

                                        {actionLoading ===
                                            credential.id
                                            ? "Processing..."
                                            : "Restore"}

                                    </button>


                                    {/* PERMANENT DELETE */}

                                    <button
                                        type="button"
                                        disabled={
                                            actionLoading ===
                                            credential.id
                                        }
                                        onClick={() =>
                                            handlePermanentDelete(
                                                credential.id
                                            )
                                        }
                                    >

                                        Permanently Delete

                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </section>
    );
}


export default Trash;