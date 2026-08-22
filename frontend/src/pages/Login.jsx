import { useState } from "react";
import PasswordField from "../components/PasswordField";
import { loginUser } from "../services/authService";

function Login({
    onMfaRequired,
    onForgotPassword,
    onRegister,
}) {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


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
        setLoading(true);

        try {

            const response =
                await loginUser(formData);

            if (response.success) {

                const data =
                    response.data;

                if (data.mfaRequired) {

                    onMfaRequired(
                        data.email
                    );

                } else if (data.token) {

                    localStorage.setItem(
                        "securevault_token",
                        data.token
                    );
                }

            } else {

                setError(
                    response.message ||
                    "Login failed."
                );
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Invalid email or password."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="auth-page">

            <div className="auth-card">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="auth-header">

                    <h1>
                        Welcome Back
                    </h1>

                    <p>
                        Sign in to your SecureVault account
                    </p>

                </div>


                {/* =================================================
                    LOGIN FORM
                ================================================= */}

                <form onSubmit={handleSubmit}>


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
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                            disabled={loading}
                        />

                    </div>


                    {/* =================================================
                        FORGOT PASSWORD
                    ================================================= */}

                    <div className="forgot-password-row">

                        <button
                            type="button"
                            className="text-button"
                            onClick={
                                onForgotPassword
                            }
                            disabled={loading}
                        >
                            Forgot password?
                        </button>

                    </div>


                    {error && (

                        <div className="error-message">
                            {error}
                        </div>

                    )}


                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing In..."
                            : "Sign In"}

                    </button>

                </form>


                {/* =================================================
                    REGISTER
                ================================================= */}

                <div className="auth-footer">

                    Don't have an account?

                    <button
                        type="button"
                        onClick={onRegister}
                        disabled={loading}
                    >
                        Register
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;