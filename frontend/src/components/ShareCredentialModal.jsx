import { useState } from "react";
import { shareCredential } from "../services/shareService";

function ShareCredentialModal({
    credential,
    userId,
    onClose,
    onShared,
}) {

    const [sharedWithUserId, setSharedWithUserId] =
        useState("");

    const [permission, setPermission] =
        useState("READ");
    const [expiration, setExpiration] =
        useState("NEVER");
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =========================================================
    // SHARE CREDENTIAL
    // =========================================================

    const handleShare = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        // -----------------------------------------------------
        // Validate User ID
        // -----------------------------------------------------

        if (!sharedWithUserId.trim()) {

            setError(
                "Please enter the user ID."
            );

            return;
        }

        const targetUserId =
            Number(sharedWithUserId);

        if (
            !Number.isInteger(targetUserId) ||
            targetUserId <= 0
        ) {

            setError(
                "Please enter a valid user ID."
            );

            return;
        }

        // -----------------------------------------------------
        // Validate Credential
        // -----------------------------------------------------

        if (!credential?.id) {

            setError(
                "Credential information is missing."
            );

            return;
        }

        // -----------------------------------------------------
        // Validate Current User
        // -----------------------------------------------------

        if (!userId) {

            setError(
                "Current user information is missing."
            );

            return;
        }

        try {

            setLoading(true);

            let expiresAt = null;

            if (expiration !== "NEVER") {

                const expirationDate =
                    new Date();

                expirationDate.setMinutes(
                    expirationDate.getMinutes() +
                    Number(expiration)
                );

                expiresAt =
                    expirationDate
                        .toISOString()
                        .slice(0, 19);
            }

            const response =
                await shareCredential(
                    credential.id,
                    targetUserId,
                    permission,
                    expiresAt
                );

            /*
             * IMPORTANT:
             *
             * POST /api/share currently returns a plain String:
             *
             * "Credential shared successfully."
             *
             * It does NOT return:
             *
             * {
             *     success: true,
             *     message: "..."
             * }
             *
             * Therefore we must NOT check response.success.
             */

            setSuccess(
                response ||
                "Credential shared successfully."
            );

            setSharedWithUserId("");

            if (onShared) {
                onShared();
            }

        } catch (err) {

            console.error(
                "Share credential error:",
                err
            );

            // -------------------------------------------------
            // Backend error handling
            // -------------------------------------------------

            const backendMessage =
                err.response?.data?.message ||
                err.response?.data;

            if (
                typeof backendMessage ===
                "string"
            ) {

                setError(
                    backendMessage
                );

            } else {

                setError(
                    "Unable to share credential."
                );
            }

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="modal-overlay">

            <div className="credential-modal">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="modal-header">

                    <div>

                        <h2>
                            Share Credential
                        </h2>

                        <p>
                            {credential?.title}
                        </p>

                    </div>

                    <button
                        className="modal-close"
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        ×
                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    onSubmit={handleShare}
                >

                    {/* =================================================
                        USER ID
                    ================================================= */}

                    <div className="detail-group">

                        <label>
                            User ID
                        </label>

                        <input
                            type="number"
                            min="1"
                            value={sharedWithUserId}
                            onChange={(event) =>
                                setSharedWithUserId(
                                    event.target.value
                                )
                            }
                            placeholder="Enter recipient user ID"
                            disabled={loading}
                        />

                    </div>


                    {/* =================================================
                        PERMISSION
                    ================================================= */}

                    <div className="detail-group">

                        <label>
                            Permission
                        </label>

                        <select
                            value={permission}
                            onChange={(event) =>
                                setPermission(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                        >

                            <option value="READ">
                                READ - View only
                            </option>

                            <option value="EDIT">
                                EDIT - View and modify
                            </option>
                            <option value="FULL_MANAGEMENT">
                                FULL_MANAGEMENT - Full management
                            </option>

                        </select>

                    </div>
                    <div className="detail-group">

                        <label>
                            Access Expiration
                        </label>

                        <select
                            value={expiration}
                            onChange={(event) =>
                                setExpiration(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                        >

                            <option value="NEVER">
                                No expiration
                            </option>

                            <option value="60">
                                1 hour
                            </option>

                            <option value="1440">
                                1 day
                            </option>

                            <option value="10080">
                                7 days
                            </option>

                            <option value="43200">
                                30 days
                            </option>

                        </select>

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
                        SUCCESS
                    ================================================= */}

                    {success && (

                        <div className="success-message">
                            {success}
                        </div>

                    )}


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="add-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Sharing..."
                                : "Share Credential"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default ShareCredentialModal;