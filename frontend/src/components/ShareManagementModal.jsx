import { useEffect, useState } from "react";

import {
    getCredentialShares,
    updateSharePermission,
    revokeShare,
} from "../services/shareService";


function ShareManagementModal({
    credential,
    onClose,
}) {

    const [shares, setShares] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [actionLoading, setActionLoading] =
        useState(null);


    // =========================================================
    // LOAD SHARES
    // =========================================================

    useEffect(() => {

        if (credential?.id) {
            loadShares();
        }

    }, [credential]);


    const loadShares = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getCredentialShares(
                    credential.id
                );

            if (response?.success) {

                setShares(
                    response.data || []
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to load sharing information."
                );
            }

        } catch (err) {

            console.error(
                "Load shares error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load sharing information."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // CHANGE PERMISSION
    // =========================================================

    const handlePermissionChange = async (
        shareId,
        permission
    ) => {

        try {

            setActionLoading(shareId);
            setError("");

            const response =
                await updateSharePermission(
                    shareId,
                    permission
                );

            if (!response?.success) {

                setError(
                    response?.message ||
                    "Unable to update permission."
                );

                return;
            }

            await loadShares();

        } catch (err) {

            console.error(
                "Permission update error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to update permission."
            );

        } finally {

            setActionLoading(null);
        }
    };


    // =========================================================
    // REVOKE
    // =========================================================

    const handleRevoke = async (
        shareId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to revoke access to this credential?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(shareId);
            setError("");

            const response =
                await revokeShare(
                    shareId
                );

            if (!response?.success) {

                setError(
                    response?.message ||
                    "Unable to revoke sharing."
                );

                return;
            }

            await loadShares();

        } catch (err) {

            console.error(
                "Revoke share error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to revoke sharing."
            );

        } finally {

            setActionLoading(null);
        }
    };


    return (

        <div className="modal-overlay">

            <div className="credential-modal share-management-modal">

                {/* HEADER */}

                <div className="modal-header">

                    <div>

                        <h2>
                            Manage Sharing
                        </h2>

                        <p>
                            {credential?.title}
                        </p>

                    </div>

                    <button
                        className="modal-close"
                        type="button"
                        onClick={onClose}
                        disabled={
                            actionLoading !== null
                        }
                    >
                        ×
                    </button>

                </div>


                {/* ERROR */}

                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


                {/* LOADING */}

                {loading ? (

                    <div className="loading">
                        Loading sharing information...
                    </div>

                ) : shares.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            Not shared with anyone
                        </h3>

                        <p>
                            This credential is currently
                            private.
                        </p>

                    </div>

                ) : (

                    <div className="share-management-list">

                        {shares.map(
                            (share) => (

                                <div
                                    className="share-management-card"
                                    key={share.shareId}
                                >

                                    {/* USER */}

                                    <div className="share-user-info">

                                        <div className="share-user-avatar">

                                            {share.sharedWithName
                                                ?.charAt(0)
                                                ?.toUpperCase() || "U"}

                                        </div>

                                        <div>

                                            <strong>
                                                {share.sharedWithName}
                                            </strong>

                                            <span>
                                                {share.sharedWithEmail}
                                            </span>

                                        </div>

                                    </div>


                                    {/* PERMISSION */}

                                    <div className="share-management-controls">

                                        <label>
                                            Permission
                                        </label>

                                        <select
                                            value={
                                                share.permission
                                            }
                                            disabled={
                                                actionLoading ===
                                                share.shareId
                                            }
                                            onChange={(event) =>
                                                handlePermissionChange(
                                                    share.shareId,
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="READ">
                                                READ - View only
                                            </option>

                                            <option value="EDIT">
                                                EDIT - View and modify
                                            </option>

                                        </select>


                                        <button
                                            type="button"
                                            className="delete-confirm-button"
                                            disabled={
                                                actionLoading ===
                                                share.shareId
                                            }
                                            onClick={() =>
                                                handleRevoke(
                                                    share.shareId
                                                )
                                            }
                                        >

                                            {actionLoading ===
                                                share.shareId
                                                ? "Processing..."
                                                : "Revoke Access"}

                                        </button>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                )}


                {/* FOOTER */}

                <div className="modal-actions">

                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onClose}
                        disabled={
                            actionLoading !== null
                        }
                    >
                        Close
                    </button>

                </div>

            </div>

        </div>
    );
}


export default ShareManagementModal;