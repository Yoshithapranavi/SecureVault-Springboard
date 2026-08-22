import { useState } from "react";

import {
    generatePassword,
    checkPasswordStrength,
} from "../services/passwordService";
import PasswordDisplay from "./PasswordDisplay";


function PasswordGenerator() {

    const [length, setLength] =
        useState(16);

    const [uppercase, setUppercase] =
        useState(true);

    const [lowercase, setLowercase] =
        useState(true);

    const [numbers, setNumbers] =
        useState(true);

    const [symbols, setSymbols] =
        useState(true);

    const [password, setPassword] =
        useState("");

    const [strength, setStrength] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [copied, setCopied] =
        useState(false);


    // =========================================================
    // GENERATE
    // =========================================================

    const handleGenerate = async () => {

        setError("");
        setCopied(false);
        setStrength(null);


        // -----------------------------------------------------
        // CHARACTER TYPE VALIDATION
        // -----------------------------------------------------

        if (
            !uppercase &&
            !lowercase &&
            !numbers &&
            !symbols
        ) {

            setError(
                "Select at least one character type."
            );

            return;
        }


        // -----------------------------------------------------
        // LENGTH VALIDATION
        // -----------------------------------------------------

        if (
            length < 8 ||
            length > 64
        ) {

            setError(
                "Password length must be between 8 and 64 characters."
            );

            return;
        }


        try {

            setLoading(true);

            const response =
                await generatePassword({
                    length,
                    uppercase,
                    lowercase,
                    numbers,
                    symbols,
                });


            if (!response?.success) {

                setError(
                    response?.message ||
                    "Unable to generate password."
                );

                return;
            }


            const generated =
                response.data?.password || "";


            if (!generated) {

                setError(
                    "The server returned an empty password."
                );

                return;
            }


            setPassword(
                generated
            );


            // -------------------------------------------------
            // CHECK GENERATED PASSWORD STRENGTH
            // -------------------------------------------------

            const strengthResponse =
                await checkPasswordStrength(
                    generated
                );


            if (
                strengthResponse?.success
            ) {

                setStrength(
                    strengthResponse.data
                );
            }

        } catch (err) {

            console.error(
                "Password generation error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to generate password."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // COPY
    // =========================================================

    const handleCopy = async () => {

        if (!password) {
            return;
        }

        try {

            await navigator.clipboard.writeText(
                password
            );

            setCopied(true);

            setTimeout(() => {

                setCopied(false);

            }, 1800);

        } catch (err) {

            console.error(
                "Copy failed:",
                err
            );

            setError(
                "Unable to copy password."
            );
        }
    };


    // =========================================================
    // STRENGTH CLASS
    // =========================================================

    const strengthClass =
        strength?.strength
            ?.toLowerCase()
            .replace(/\s+/g, "-") || "";


    return (

        <section className="content-page">


            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="page-heading">

                <div>

                    <span className="eyebrow">
                        VAULT
                    </span>

                    <h1>
                        Password Generator
                    </h1>

                    <p>
                        Generate strong passwords
                        securely without saving them to your vault.
                    </p>

                </div>

            </div>


            <div className="generator-layout">


                {/* =================================================
                    SETTINGS
                ================================================= */}

                <div className="generator-card">

                    <div className="generator-card-header">

                        <div>

                            <h2>
                                Generator settings
                            </h2>

                            <p>
                                Customize the password
                                you want to generate.
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        LENGTH
                    ================================================= */}

                    <div className="generator-length">

                        <div className="generator-field-heading">

                            <label>
                                Password length
                            </label>

                            <strong>
                                {length}
                            </strong>

                        </div>


                        <input
                            type="range"
                            min="8"
                            max="64"
                            value={length}
                            onChange={(event) =>
                                setLength(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                            disabled={loading}
                        />


                        <div className="range-labels">

                            <span>
                                8
                            </span>

                            <span>
                                64
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        CHARACTER TYPES
                    ================================================= */}

                    <div className="generator-options">

                        <label className="generator-option">

                            <input
                                type="checkbox"
                                checked={uppercase}
                                onChange={(event) =>
                                    setUppercase(
                                        event.target.checked
                                    )
                                }
                                disabled={loading}
                            />

                            <span>
                                Uppercase letters
                            </span>

                        </label>


                        <label className="generator-option">

                            <input
                                type="checkbox"
                                checked={lowercase}
                                onChange={(event) =>
                                    setLowercase(
                                        event.target.checked
                                    )
                                }
                                disabled={loading}
                            />

                            <span>
                                Lowercase letters
                            </span>

                        </label>


                        <label className="generator-option">

                            <input
                                type="checkbox"
                                checked={numbers}
                                onChange={(event) =>
                                    setNumbers(
                                        event.target.checked
                                    )
                                }
                                disabled={loading}
                            />

                            <span>
                                Numbers
                            </span>

                        </label>


                        <label className="generator-option">

                            <input
                                type="checkbox"
                                checked={symbols}
                                onChange={(event) =>
                                    setSymbols(
                                        event.target.checked
                                    )
                                }
                                disabled={loading}
                            />

                            <span>
                                Special characters
                            </span>

                        </label>

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
                        GENERATE BUTTON
                    ================================================= */}

                    <button
                        type="button"
                        className="primary-button generator-button"
                        onClick={handleGenerate}
                        disabled={loading}
                    >

                        {loading
                            ? "Generating..."
                            : "Generate Password"}

                    </button>

                </div>


                {/* =================================================
                    RESULT
                ================================================= */}

                <div className="generator-card generator-result-card">

                    <span className="eyebrow">
                        GENERATED PASSWORD
                    </span>

                    <h2>
                        Your secure password
                    </h2>


                    <div className="generated-password">

                        <PasswordDisplay
                            value={password}
                        />

                        <button
                            type="button"
                            onClick={handleCopy}
                            disabled={!password}
                        >

                            {copied
                                ? "Copied"
                                : "Copy"}

                        </button>

                    </div>


                    {/* =================================================
                        STRENGTH
                    ================================================= */}

                    {strength && (

                        <div className="generated-strength">

                            <div>

                                <span>
                                    Password strength
                                </span>

                                <strong
                                    className={
                                        `strength-${strengthClass}`
                                    }
                                >
                                    {strength.strength}
                                </strong>

                            </div>


                            <span>
                                Score{" "}
                                {strength.score}/5
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        EMPTY
                    ================================================= */}

                    {!password && (

                        <p className="generator-empty">
                            Choose your settings and
                            generate a password.
                        </p>

                    )}

                </div>

            </div>

        </section>
    );
}


export default PasswordGenerator;