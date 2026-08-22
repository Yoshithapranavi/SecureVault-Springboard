import { useState } from "react";

import {
    changePassword,
} from "../services/profileService";

import PasswordField from "./PasswordField";

function ChangePassword() {

    const [formData, setFormData] =
        useState({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const handleChange = (event) => {

        setFormData({
            ...formData,
            [event.target.name]:
                event.target.value,
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

            setError(
                "All password fields are required."
            );

            return;
        }

        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {

            setError(
                "New passwords do not match."
            );

            return;
        }

        if (
            formData.currentPassword ===
            formData.newPassword
        ) {

            setError(
                "New password must be different from the current password."
            );

            return;
        }

        try {

            setLoading(true);

            const response =
                await changePassword({
                    currentPassword:
                        formData.currentPassword,

                    newPassword:
                        formData.newPassword,
                });

            if (response?.success) {

                setSuccess(
                    response.message ||
                    "Password changed successfully."
                );

                setFormData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

            } else {

                setError(
                    response?.message ||
                    "Unable to change password."
                );
            }

        } catch (err) {

            console.error(
                "Change password error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to change password."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <section className="content-page">

            <div className="page-heading">

                <div>

                    <span className="eyebrow">
                        SECURITY
                    </span>

                    <h1>
                        Change Password
                    </h1>

                    <p>
                        Update your SecureVault
                        account password.
                    </p>

                </div>

            </div>


            <div className="profile-card">

                <form onSubmit={handleSubmit}>

                    <div className="detail-group">

                        <label>
                            Current Password
                        </label>

                        <PasswordField
                            id="current-password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Current password"
                            autoComplete="current-password"
                            required
                            disabled={loading}
                        />

                    </div>


                    <div className="detail-group">

                        <label>
                            New Password
                        </label>

                        <PasswordField
                            id="new-password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="New password"
                            autoComplete="new-password"
                            required
                            disabled={loading}
                        />

                    </div>


                    <div className="detail-group">

                        <label>
                            Confirm New Password
                        </label>

                        <PasswordField
                            id="confirm-password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            autoComplete="new-password"
                            required
                            disabled={loading}
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
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Updating..."
                                : "Change Password"}
                        </button>

                    </div>

                </form>

            </div>

        </section>
    );
}

export default ChangePassword;