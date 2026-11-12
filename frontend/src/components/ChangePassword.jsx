import { useState } from "react";

import { changePassword } from "../services/profileService";

import PasswordField from "./PasswordField";
import Icon from "./Icon";

function ChangePassword() {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.currentPassword ||
            !formData.newPassword ||
            !formData.confirmPassword
        ) {
            setError("All password fields are required.");
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        if (formData.currentPassword === formData.newPassword) {
            setError(
                "New password must be different from the current password.",
            );
            return;
        }

        try {
            setLoading(true);

            const response = await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            if (response?.success) {
                setSuccess(
                    response.message || "Password changed successfully.",
                );

                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            } else {
                setError(response?.message || "Unable to change password.");
            }
        } catch (err) {
            console.error("Change password error:", err);

            setError(
                err.response?.data?.message || "Unable to change password.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="sv-page-stack">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Account security</span>
                    <h1>Change Password</h1>
                    <p>
                        Update the password used to sign in to SecureVault. The
                        change applies to your account, not to credentials
                        stored in the vault.
                    </p>
                </div>
            </header>

            {error && (
                <div className="sv-error-panel" role="alert">
                    <div className="sv-error-icon" aria-hidden="true">
                        <Icon name="warning" />
                    </div>
                    <div>
                        <h2>Password not changed</h2>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="success-message" role="status">
                    <span>{success}</span>
                </div>
            )}

            <div className="sv-form-layout">
                <div className="sv-form-panel">
                    <div className="sv-panel-heading">
                        <div>
                            <span className="sv-eyebrow">Sign-in credential</span>
                            <h2>Update account password</h2>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="detail-group">
                            <label htmlFor="current-password">
                                Current password
                            </label>

                            <PasswordField
                                id="current-password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                                placeholder="Enter your current password"
                                autoComplete="current-password"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="detail-group">
                            <label htmlFor="new-password">New password</label>

                            <PasswordField
                                id="new-password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                                placeholder="Enter a new password"
                                autoComplete="new-password"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="detail-group">
                            <label htmlFor="confirm-password">
                                Confirm new password
                            </label>

                            <PasswordField
                                id="confirm-password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repeat the new password"
                                autoComplete="new-password"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="sv-form-actions">
                            <button
                                type="submit"
                                className="sv-btn sv-btn-primary"
                                disabled={loading}
                            >
                                <Icon name="lock" size={16} />
                                {loading ? "Updating…" : "Change password"}
                            </button>
                        </div>
                    </form>
                </div>

                <aside className="sv-panel">
                    <div className="sv-panel-heading">
                        <div>
                            <span className="sv-eyebrow">Guidance</span>
                            <h2>Choosing a password</h2>
                        </div>
                    </div>

                    <p className="sv-panel-copy">
                        Your SecureVault sign-in password protects access to
                        every credential in your vault. Treat it differently
                        from the passwords you store.
                    </p>

                    <ul className="sv-policy-list">
                        <li>
                            Aim for a long, unique password that is not used on
                            any other service.
                        </li>
                        <li>
                            A short passphrase is easier to remember and harder
                            to guess than a single complex word.
                        </li>
                        <li>
                            SecureVault does not reveal your current password.
                            If you cannot recall it, use the recovery flow from
                            the sign-in screen.
                        </li>
                        <li>
                            Changing this password does not rotate the
                            credentials saved in your vault.
                        </li>
                    </ul>
                </aside>
            </div>
        </section>
    );
}

export default ChangePassword;
