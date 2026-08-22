import { useState } from "react";
import PasswordField from "../components/PasswordField";

import {
    registerUser,
} from "../services/authService";


function Register({
    onBackToLogin,
}) {

    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            password: "",
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
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password ||
            !formData.confirmPassword
        ) {

            setError(
                "All fields are required."
            );

            return;
        }


        if (
            formData.password !==
            formData.confirmPassword
        ) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        if (
            formData.password.length < 8
        ) {

            setError(
                "Password must contain at least 8 characters."
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await registerUser({
                    name:
                        formData.name.trim(),

                    email:
                        formData.email.trim(),

                    password:
                        formData.password,
                });


            if (response?.success) {

                setSuccess(
                    response.message ||
                    "Registration successful. You can now sign in."
                );

                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                });

            } else {

                setError(
                    response?.message ||
                    "Unable to create your account."
                );
            }

        } catch (err) {

            console.error(
                "Registration error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to create your account."
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
                        Create Account
                    </h1>

                    <p>
                        Create your SecureVault account
                    </p>

                </div>


                <form
                    onSubmit={handleSubmit}
                >


                    <div className="form-group">

                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                            maxLength={100}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <PasswordField
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            autoComplete="new-password"
                            minLength={8}
                            required
                            disabled={loading}
                        />

                    </div>


                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <PasswordField
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            autoComplete="new-password"
                            minLength={8}
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
                            ? "Creating Account..."
                            : "Create Account"}

                    </button>

                </form>


                <div className="auth-footer">

                    Already have an account?

                    <button
                        type="button"
                        onClick={onBackToLogin}
                        disabled={loading}
                    >
                        Sign In
                    </button>

                </div>

            </div>

        </div>
    );
}


export default Register;