import { useState } from "react";
import { verifyMfa } from "../services/authService";

function MfaVerification({ email, onVerified }) {
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (otp.length !== 6) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        setLoading(true);

        try {
            const response = await verifyMfa({
                email: email,
                otp: otp,
            });

            if (response.success && response.data?.token) {
                onVerified(response.data.token);
            } else {
                setError(
                    response.message || "OTP verification failed."
                );
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid or expired OTP."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">

                <div className="auth-header">
                    <h1>Verify Your Login</h1>

                    <p>
                        Enter the 6-digit verification code sent to
                    </p>

                    <strong>{email}</strong>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="otp">
                            Verification Code
                        </label>

                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            inputMode="numeric"
                            maxLength="6"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(event) =>
                                setOtp(
                                    event.target.value.replace(/\D/g, "")
                                )
                            }
                            required
                        />
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
                            ? "Verifying..."
                            : "Verify & Continue"}
                    </button>

                </form>

                <div className="auth-footer">
                    OTP is valid for 5 minutes.
                </div>

            </div>
        </div>
    );
}

export default MfaVerification;