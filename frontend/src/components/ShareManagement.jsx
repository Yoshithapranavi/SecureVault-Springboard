import { useEffect, useState } from "react";

import {
    getCredentialShares,
    updateSharePermission,
    revokeShare,
} from "../services/shareService";

function ShareManagement({
    credential,
    onClose,
}) {

    const [shares, setShares] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [actionLoading, setActionLoading] =
        useState(null);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =========================================================
    // LOAD SHARES
    // =========================================================

    useEffect(() => {

        loadShares();

    }, [credential?.id]);


    const loadShares = async () => {

        if (!credential?.id) {
            return;
        }

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
                    "Unable to load sharing details."
                );
            }

        } catch (err) {

            console.error(
                "Load shares error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load sharing details."
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
            setSuccess("");

            const response =
                await updateSharePermission(
                    shareId,
                    permission
                );

            if (response?.success) {

                setSuccess(
                    response.message ||
                    "Permission updated successfully."
                );

                await loadShares();

            } else {

                setError(
                    response?.message ||
                    "Unable to update permission."
                );
            }

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
            setSuccess("");

            const response =
                await revokeShare(
                    shareId
                );

            if (response?.success) {

                setSuccess(
                    response.message ||
                    "Access revoked successfully."
                );

                await loadShares();

            } else {

                setError(
                    response?.message ||
                    "Unable to revoke access."
                );
            }

        } catch (err) {

            console.error(
                "Revoke share error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to revoke access."
            );

        } finally {

            setActionLoading(null);
        }
    };


    return (

        <div className="modal-overlay">

            <div className="credential-modal share-management-modal">

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
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>

                </div>


                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}


                {success && (
                    <div className="success-message">
                        {success}
                    </div>
                )}


                {loading ? (

                    <div className="loading">
                        Loading sharing details...
                    </div>

                ) : shares.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No active shares
                        </h3>

                        <p>
                            This credential is not
                            currently shared with anyone.
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

                                    <div className="share-user-info">

                                        <div className="share-user-avatar">
                                            {share.sharedWithName
                                                ?.charAt(0)
                                                ?.toUpperCase() ||
                                                "U"}
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


                                    <div className="share-permission">

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
                                            onChange={(
                                                event
                                            ) =>
                                                handlePermissionChange(
                                                    share.shareId,
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="READ">
                                                READ
                                            </option>

                                            <option value="EDIT">
                                                EDIT
                                            </option>
                                            <option value="FULL_MANAGEMENT">
                                                FULL_MANAGEMENT - Full management
                                            </option>

                                        </select>

                                    </div>


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

                            )
                        )}

                    </div>

                )}


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

export default ShareManagement;