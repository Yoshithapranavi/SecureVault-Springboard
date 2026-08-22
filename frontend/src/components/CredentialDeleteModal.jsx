import { useState } from "react";
import { deleteCredential } from "../services/vaultService";

function CredentialDeleteModal({
    credential,
    userId,
    onClose,
    onDeleted,
}) {

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await deleteCredential(
                    credential.id,
                    userId
                );

            if (response.success) {

                onDeleted();

            } else {

                setError(
                    response.message ||
                    "Unable to delete credential."
                );
            }

        } catch (err) {

            console.error(
                "Delete credential error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to delete credential."
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
                    event.currentTarget &&
                    !loading
                ) {
                    onClose();
                }

            }}
        >

            <div
                className="credential-modal delete-modal"
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="modal-header">

                    <div className="modal-title-row">

                        <div className="delete-icon">
                            !
                        </div>

                        <div>

                            <h2>
                                Delete Credential
                            </h2>

                            <p>
                                Move this credential to Trash?
                            </p>

                        </div>

                    </div>


                    <button
                        className="modal-close"
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                    >
                        ×
                    </button>

                </div>


                {/* =================================================
                    CREDENTIAL INFO
                ================================================= */}

                <div className="delete-credential-info">

                    <div className="delete-credential-title">

                        <div className="delete-credential-avatar">
                            {(credential?.title || "C")
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div>

                            <h3>
                                {credential?.title ||
                                    "Credential"}
                            </h3>

                            <p>
                                {credential?.username ||
                                    "No username"}
                            </p>

                        </div>

                    </div>


                    {credential?.category && (

                        <span className="delete-category">
                            {credential.category}
                        </span>

                    )}

                </div>


                {/* =================================================
                    WARNING
                ================================================= */}

                <div className="delete-warning">

                    <div className="warning-icon">
                        !
                    </div>

                    <div>

                        <strong>
                            This credential will be moved to Trash
                        </strong>

                        <p>
                            You can restore it later from
                            the Trash section. It will not
                            be permanently deleted yet.
                        </p>

                    </div>

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
                        type="button"
                        className="delete-confirm-button"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        {loading
                            ? "Moving to Trash..."
                            : "Move to Trash"}
                    </button>

                </div>

            </div>

        </div>
    );
}

export default CredentialDeleteModal;