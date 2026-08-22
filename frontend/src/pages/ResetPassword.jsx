import { useState } from "react";
import PasswordField from "../components/PasswordField";

import {
    resetPassword,
} from "../services/authService";


function ResetPassword({
    token,
    onBackToLogin,
}) {

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        if (!password || !confirmPassword) {

            setError(
                "Please enter and confirm your new password."
            );

            return;
        }


        if (password.length < 8) {

            setError(
                "Password must contain at least 8 characters."
            );

            return;
        }


        if (
            password !==
            confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        if (!token) {

            setError(
                "Password reset token is missing or invalid."
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await resetPassword(
                    token,
                    password
                );


            if (response?.success) {

                setSuccess(
                    response.message ||
                    "Password reset successfully."
                );

                setPassword("");
                setConfirmPassword("");

            } else {

                setError(
                    response?.message ||
                    "Unable to reset password."
                );
            }

        } catch (err) {

            console.error(
                "Reset password error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to reset password. The reset link may be invalid or expired."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">

                    <h1>
                        Reset Password
                    </h1>

                    <p>
                        Create a new password for
                        your SecureVault account.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="password">
                            New Password
                        </label>

                        <PasswordField
                            id="password"
                            name="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter new password"
                            autoComplete="new-password"
                            required
                            disabled={loading}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>

                        <PasswordField
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(event.target.value)
                            }
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


                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Resetting..."
                            : "Reset Password"}

                    </button>

                </form>


                {success && (

                    <div className="auth-footer">

                        <button
                            type="button"
                            onClick={onBackToLogin}
                        >
                            ← Back to Login
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}


export default ResetPassword;