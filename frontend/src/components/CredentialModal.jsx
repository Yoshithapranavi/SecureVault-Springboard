import { useState } from "react";
import { createCredential } from "../services/vaultService";
import PasswordField from "./PasswordField";

function CredentialModal({ userId, onClose, onCreated }) {

    const [formData, setFormData] = useState({
        title: "",
        category: "PERSONAL",
        username: "",
        password: "",
        websiteUrl: "",
        notes: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const categories = [
        "PERSONAL",
        "WORK",
        "DEVELOPMENT",
        "SOCIAL",
        "BANKING",
        "ENTERTAINMENT",
        "OTHER",
    ];

    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response =
                await createCredential(formData);

            if (response.success) {

                onCreated();
                onClose();

            } else {

                setError(
                    response.message ||
                    "Unable to create credential."
                );
            }

        } catch (err) {

            console.error(
                "Create credential error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to create credential."
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
                className="credential-modal"
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
                                Add Credential
                            </h2>

                            <p>
                                Store a new credential securely.
                            </p>

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
                    FORM
                ================================================= */}

                <form onSubmit={handleSubmit}>

                    {/* TITLE */}

                    <div className="form-group">

                        <label htmlFor="credential-title">
                            Title
                        </label>

                        <input
                            id="credential-title"
                            name="title"
                            type="text"
                            placeholder="e.g. GitHub"
                            value={formData.title}
                            onChange={handleChange}
                            autoComplete="off"
                            required
                        />

                    </div>


                    {/* CATEGORY */}

                    <div className="form-group">

                        <label htmlFor="credential-category">
                            Category
                        </label>

                        <select
                            id="credential-category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >

                            {categories.map(
                                (category) => (

                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* USERNAME */}

                    <div className="form-group">

                        <label htmlFor="credential-username">
                            Username
                        </label>

                        <input
                            id="credential-username"
                            name="username"
                            type="text"
                            placeholder="Username or email"
                            value={formData.username}
                            onChange={handleChange}
                            autoComplete="username"
                            required
                        />

                    </div>


                    {/* PASSWORD */}

                    <div className="form-group">

                        <label htmlFor="credential-password">
                            Password
                        </label>

                        <PasswordField
                            id="credential-password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            autoComplete="new-password"
                            required
                        />

                        <span className="form-hint">
                            Your password is encrypted before being stored.
                        </span>

                    </div>


                    {/* WEBSITE */}

                    <div className="form-group">

                        <label htmlFor="credential-website">
                            Website URL
                        </label>

                        <input
                            id="credential-website"
                            name="websiteUrl"
                            type="url"
                            placeholder="https://example.com"
                            value={formData.websiteUrl}
                            onChange={handleChange}
                            autoComplete="url"
                        />

                    </div>


                    {/* NOTES */}

                    <div className="form-group">

                        <label htmlFor="credential-notes">
                            Secure Notes
                        </label>

                        <textarea
                            id="credential-notes"
                            name="notes"
                            placeholder="Add private notes..."
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                        />

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="error-message">
                            {error}
                        </div>

                    )}


                    {/* ACTIONS */}

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
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Saving..."
                                : "Save Credential"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default CredentialModal;