import { useEffect, useState } from "react";
import {
    getCredential,
    updateCredential,
} from "../services/vaultService";
import PasswordField from "./PasswordField";

function CredentialEditModal({
    credentialId,
    userId,
    onClose,
    onUpdated,
}) {
    const [formData, setFormData] = useState({
        title: "",
        category: "PERSONAL",
        username: "",
        password: "",
        websiteUrl: "",
        notes: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const categories = [
        "PERSONAL",
        "WORK",
        "DEVELOPMENT",
        "SOCIAL",
        "BANKING",
        "ENTERTAINMENT",
        "OTHER",
    ];

    useEffect(() => {
        loadCredential();
    }, [credentialId, userId]);

    const loadCredential = async () => {
        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await getCredential(credentialId);

            if (response.success) {
                const credential = response.data;

                setFormData({
                    title: credential.title || "",
                    category: credential.category || "PERSONAL",
                    username: credential.username || "",
                    password: credential.password || "",
                    websiteUrl: credential.websiteUrl || "",
                    notes: credential.notes || "",
                });
            } else {
                setError(
                    response.message ||
                    "Unable to load credential."
                );
            }
        } catch (err) {
            console.error("Load credential error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load credential."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const response = await updateCredential(
                credentialId,
                {
                    ...formData,
                    userId: userId,
                }
            );

            if (response.success) {
                setSuccess(
                    response.message ||
                    "Credential updated successfully."
                );

                if (onUpdated) {
                    onUpdated();
                }

                setTimeout(() => {
                    onClose();
                }, 900);
            } else {
                setError(
                    response.message ||
                    "Unable to update credential."
                );
            }
        } catch (err) {
            console.error("Update credential error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to update credential."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div
            className="modal-overlay"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !saving
                ) {
                    onClose();
                }
            }}
        >
            <div
                className="credential-modal credential-edit-modal"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <div className="modal-title-row">
                        <span className="modal-security-icon">
                            ✎
                        </span>

                        <div>
                            <h2>Edit Credential</h2>
                            <p>
                                Update your credential securely.
                            </p>
                        </div>
                    </div>

                    <button
                        className="modal-close"
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {loading && (
                    <div className="modal-loading-state">
                        <div className="loading-spinner">⟳</div>
                        <span>Loading credential...</span>
                    </div>
                )}

                {!loading && (
                    <form
                        onSubmit={handleSubmit}
                        className="credential-edit-form"
                    >
                        <div className="form-group">
                            <label htmlFor="edit-credential-title">
                                Title
                            </label>

                            <input
                                id="edit-credential-title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. GitHub"
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-credential-category">
                                Category
                            </label>

                            <select
                                id="edit-credential-category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                disabled={saving}
                            >
                                {categories.map((category) => (
                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-credential-username">
                                Username
                            </label>

                            <input
                                id="edit-credential-username"
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Username or email"
                                autoComplete="username"
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-credential-password">
                                Password
                            </label>

                            <PasswordField
                                id="edit-credential-password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                autoComplete="new-password"
                                required
                                disabled={saving}
                            />

                            <span className="form-hint">
                                Your credential password is encrypted before storage.
                            </span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-credential-website">
                                Website URL
                            </label>

                            <input
                                id="edit-credential-website"
                                type="url"
                                name="websiteUrl"
                                value={formData.websiteUrl}
                                onChange={handleChange}
                                placeholder="https://example.com"
                                autoComplete="url"
                                disabled={saving}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="edit-credential-notes">
                                Secure Notes
                            </label>

                            <textarea
                                id="edit-credential-notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                placeholder="Add private notes..."
                                rows="4"
                                disabled={saving}
                            />
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

                        <div className="modal-actions">
                            <button
                                type="button"
                                className="cancel-button"
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="auth-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default CredentialEditModal;