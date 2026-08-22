import { useState } from "react";

function EyeIcon({ hidden = false }) {
    return hidden ? (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 3l18 18" />
            <path d="M10.6 10.7a2 2 0 0 0 2.7 2.7" />
            <path d="M9.9 4.3A10.8 10.8 0 0 1 12 4c5 0 8.5 4 9.8 6" />
            <path d="M6.2 6.2C4.4 7.4 3.2 9 2.2 10c1.3 2 4.8 6 9.8 6 1.1 0 2.1-.2 3-.5" />
        </svg>
    ) : (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.2 12s3.3-6 9.8-6 9.8 6 9.8 6-3.3 6-9.8 6-9.8-6-9.8-6Z" />
            <circle cx="12" cy="12" r="2.7" />
        </svg>
    );
}

export default function PasswordField({ value, onChange, name, id, placeholder = "", className = "", required = false, autoComplete, disabled = false, ...rest }) {
    const [visible, setVisible] = useState(false);
    return (
        <div className={`sv-password-field ${className}`}>
            <input {...rest} id={id} name={name} value={value} onChange={onChange} type={visible ? "text" : "password"} placeholder={placeholder} required={required} autoComplete={autoComplete} disabled={disabled} className="sv-password-input" />
            <button type="button" className="sv-password-toggle" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"} title={visible ? "Hide password" : "Show password"}>
                <EyeIcon hidden={visible} />
            </button>
        </div>
    );
}