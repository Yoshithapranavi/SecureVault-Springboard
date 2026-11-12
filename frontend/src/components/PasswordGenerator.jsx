import { useState } from "react";

import {
    generatePassword,
    checkPasswordStrength,
} from "../services/passwordService";
import PasswordDisplay from "./PasswordDisplay";
import Icon from "./Icon";

const OPTIONS = [
    {
        id: "uppercase",
        label: "Uppercase letters",
        hint: "A–Z",
    },
    {
        id: "lowercase",
        label: "Lowercase letters",
        hint: "a–z",
    },
    {
        id: "numbers",
        label: "Numbers",
        hint: "0–9",
    },
    {
        id: "symbols",
        label: "Symbols",
        hint: "!@#$",
    },
];

function PasswordGenerator() {
    const [length, setLength] = useState(16);
    const [uppercase, setUppercase] = useState(true);
    const [lowercase, setLowercase] = useState(true);
    const [numbers, setNumbers] = useState(true);
    const [symbols, setSymbols] = useState(true);
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const optionState = { uppercase, lowercase, numbers, symbols };
    const optionSetters = {
        uppercase: setUppercase,
        lowercase: setLowercase,
        numbers: setNumbers,
        symbols: setSymbols,
    };

    const handleGenerate = async () => {
        setError("");
        setCopied(false);
        setStrength(null);

        if (!uppercase && !lowercase && !numbers && !symbols) {
            setError("Select at least one character type.");
            return;
        }

        if (length < 8 || length > 64) {
            setError("Password length must be between 8 and 64 characters.");
            return;
        }

        try {
            setLoading(true);

            const response = await generatePassword({
                length,
                uppercase,
                lowercase,
                numbers,
                symbols,
            });

            if (!response?.success) {
                setError(
                    response?.message || "Unable to generate password.",
                );
                return;
            }

            const generated = response.data?.password || "";

            if (!generated) {
                setError("The server returned an empty password.");
                return;
            }

            setPassword(generated);

            const strengthResponse = await checkPasswordStrength(generated);

            if (strengthResponse?.success) {
                setStrength(strengthResponse.data);
            }
        } catch (err) {
            console.error("Password generation error:", err);

            setError(
                err.response?.data?.message || "Unable to generate password.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!password) return;

        try {
            await navigator.clipboard.writeText(password);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1800);
        } catch (err) {
            console.error("Copy failed:", err);
            setError("Unable to copy password.");
        }
    };

    const strengthClass =
        strength?.strength?.toLowerCase().replace(/\s+/g, "-") || "";
    const score = Number(strength?.score) || 0;

    return (
        <section className="sv-generator-page">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Vault tools</span>
                    <h1>Password Generator</h1>
                    <p>
                        Create a strong, random password without saving it to
                        your vault.
                    </p>
                </div>
            </header>

            <div className="sv-generator-layout">
                <section className="sv-generator-settings">
                    <div className="sv-panel-heading">
                        <div>
                            <span className="sv-eyebrow">Configuration</span>
                            <h2>Generator settings</h2>
                        </div>
                    </div>

                    <div className="sv-generator-length">
                        <div className="sv-generator-length-heading">
                            <label htmlFor="password-length">Password length</label>
                            <strong>{length}</strong>
                        </div>

                        <input
                            id="password-length"
                            type="range"
                            min="8"
                            max="64"
                            value={length}
                            onChange={(event) => setLength(Number(event.target.value))}
                            disabled={loading}
                        />

                        <div className="sv-range-scale">
                            <span>8</span>
                            <span>64</span>
                        </div>

                        <div className="sv-length-presets" aria-label="Length presets">
                            {[12, 16, 24, 32].map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    className={length === preset ? "is-active" : ""}
                                    onClick={() => setLength(preset)}
                                    disabled={loading}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    <fieldset className="sv-generator-options">
                        <legend>Characters to include</legend>

                        {OPTIONS.map((option) => (
                            <label className="sv-option-row" key={option.id}>
                                <span className="sv-option-copy">
                                    <strong>{option.label}</strong>
                                    <small>{option.hint}</small>
                                </span>

                                <input
                                    type="checkbox"
                                    className="sv-switch-input"
                                    checked={optionState[option.id]}
                                    onChange={(event) =>
                                        optionSetters[option.id](event.target.checked)
                                    }
                                    disabled={loading}
                                />

                                <span className="sv-switch" aria-hidden="true" />
                            </label>
                        ))}
                    </fieldset>

                    {error && (
                        <div className="sv-inline-error" role="alert">
                            {error}
                        </div>
                    )}

                    <button
                        type="button"
                        className="sv-btn sv-btn-primary sv-btn-generate"
                        onClick={handleGenerate}
                        disabled={loading}
                    >
                        <Icon name="generator" size={17} />
                        {loading ? "Generating…" : "Generate password"}
                    </button>
                </section>

                <section className="sv-generator-result">
                    <div className="sv-generator-result-heading">
                        <span className="sv-eyebrow">Generated result</span>
                        <h2>Your secure password</h2>
                        <p>
                            Generated by the SecureVault service. Copy it to the
                            account you are protecting or regenerate for a new value.
                        </p>
                    </div>

                    <div className="sv-generated-value">
                        <PasswordDisplay value={password} />

                        <button
                            type="button"
                            className={`sv-copy-button ${copied ? "is-copied" : ""}`}
                            onClick={handleCopy}
                            disabled={!password}
                        >
                            <Icon name={copied ? "check" : "password"} size={16} />
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>

                    {strength && (
                        <div className="sv-strength-block">
                            <div className="sv-strength-heading">
                                <span>Password strength</span>
                                <strong className={`sv-strength-label ${strengthClass}`}>
                                    {strength.strength}
                                </strong>
                            </div>

                            <div
                                className="sv-strength-meter"
                                role="img"
                                aria-label={`Password strength score ${score} out of 5`}
                            >
                                {[1, 2, 3, 4, 5].map((segment) => (
                                    <span
                                        key={segment}
                                        className={`${strengthClass} ${segment <= score ? "is-filled" : ""}`}
                                    />
                                ))}
                            </div>

                            <span className="sv-strength-score">
                                Score {score}/5
                            </span>
                        </div>
                    )}

                    {!password && (
                        <div className="sv-generator-empty">
                            <span className="sv-empty-icon" aria-hidden="true">
                                <Icon name="key" size={22} />
                            </span>
                            <div>
                                <strong>Nothing generated yet</strong>
                                <p>
                                    Choose your settings, then generate a password
                                    to see its strength assessment here.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="sv-generator-note">
                        <Icon name="lock" size={16} />
                        <span>
                            Passwords are generated by your SecureVault backend and
                            are never stored by this tool.
                        </span>
                    </div>
                </section>
            </div>
        </section>
    );
}

export default PasswordGenerator;
