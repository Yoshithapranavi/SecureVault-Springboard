import { useState } from "react";

import {
    forgotPassword,
} from "../services/authService";


function ForgotPassword({
    onBackToLogin,
}) {

    const [email, setEmail] =
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

        if (!email.trim()) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await forgotPassword(
                    email.trim()
                );


            if (response?.success) {

                setSuccess(
                    response.message ||
                    "If the account exists, a password reset link has been sent."
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to process password reset request."
                );
            }

        } catch (err) {

            console.error(
                "Forgot password error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to process password reset request."
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
                        Forgot Password?
                    </h1>

                    <p>
                        Enter your email address and
                        we'll help you reset your password.
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                >

                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            disabled={loading}
                            required
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
                            ? "Sending..."
                            : "Send Reset Link"}

                    </button>

                </form>


                <div className="auth-footer">

                    <button
                        type="button"
                        onClick={onBackToLogin}
                    >
                        ← Back to Login
                    </button>

                </div>

            </div>

        </div>
    );
}


export default ForgotPassword;