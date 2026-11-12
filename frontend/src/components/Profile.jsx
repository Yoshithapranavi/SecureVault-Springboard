import { useEffect, useState } from "react";

import { getProfile, updateProfile } from "../services/profileService";
import Icon from "./Icon";

function Profile() {
    const [profile, setProfile] = useState(null);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadProfile();
        // The profile is loaded once for the mounted page.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getProfile();

            if (response?.success) {
                setProfile(response.data);
                setName(response.data?.name || "");
            } else {
                setError(response?.message || "Unable to load profile.");
            }
        } catch (err) {
            console.error("Profile loading error:", err);

            setError(
                err.response?.data?.message || "Unable to load profile.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!name.trim()) {
            setError("Name is required.");
            return;
        }

        try {
            setSaving(true);

            const response = await updateProfile({ name: name.trim() });

            if (response?.success) {
                setProfile(response.data);
                setName(response.data?.name || "");
                setSuccess(
                    response.message || "Profile updated successfully.",
                );
            } else {
                setError(response?.message || "Unable to update profile.");
            }
        } catch (err) {
            console.error("Profile update error:", err);

            setError(
                err.response?.data?.message || "Unable to update profile.",
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <section className="sv-page-stack">
                <header className="sv-page-header">
                    <div>
                        <span className="sv-eyebrow">Account</span>
                        <h1>Profile</h1>
                        <p>Loading your account information…</p>
                    </div>
                </header>

                <div className="sv-loading-panel" role="status">
                    <span className="sv-loading-bar" aria-hidden="true" />
                    Loading profile…
                </div>
            </section>
        );
    }

    const displayName = profile?.name || "SecureVault user";
    const initials =
        displayName
            .split(" ")
            .map((part) => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase() || "SV";

    return (
        <section className="sv-page-stack">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Account</span>
                    <h1>Profile</h1>
                    <p>
                        Manage the identity attached to your SecureVault
                        session. Email address and role are managed by the
                        account administrator.
                    </p>
                </div>
            </header>

            {error && (
                <div className="sv-error-panel" role="alert">
                    <div className="sv-error-icon" aria-hidden="true">
                        <Icon name="warning" />
                    </div>
                    <div>
                        <h2>Profile update failed</h2>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="success-message" role="status">
                    <span>{success}</span>
                </div>
            )}

            <div className="sv-account-layout">
                <aside className="sv-identity-card">
                    <div className="sv-identity-avatar" aria-hidden="true">
                        {initials}
                    </div>

                    <h2>{displayName}</h2>
                    <p>{profile?.email || "No email address recorded"}</p>

                    <div className="sv-identity-meta">
                        <div>
                            <span>Access level</span>
                            <strong>
                                {profile?.role === "ADMIN"
                                    ? "Administrator"
                                    : profile?.role || "Member"}
                            </strong>
                        </div>

                        <div>
                            <span>Account reference</span>
                            <strong>
                                {profile?.id ? `SV-${profile.id}` : "—"}
                            </strong>
                        </div>

                        <div>
                            <span>Sign-in protection</span>
                            <strong>Password and MFA</strong>
                        </div>
                    </div>
                </aside>

                <div className="sv-form-panel">
                    <div className="sv-panel-heading">
                        <div>
                            <span className="sv-eyebrow">Account details</span>
                            <h2>Personal information</h2>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="detail-group">
                            <label htmlFor="profile-name">Display name</label>
                            <input
                                id="profile-name"
                                type="text"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                disabled={saving}
                                autoComplete="name"
                            />
                            <span className="sv-field-hint">
                                This name appears in your navigation and on
                                shared credential records.
                            </span>
                        </div>

                        <div className="detail-group">
                            <label htmlFor="profile-email">Email address</label>
                            <input
                                id="profile-email"
                                type="email"
                                value={profile?.email || ""}
                                readOnly
                            />
                        </div>

                        <div className="detail-group">
                            <label htmlFor="profile-role">Account role</label>
                            <input
                                id="profile-role"
                                type="text"
                                value={profile?.role || "USER"}
                                readOnly
                            />
                        </div>

                        <div className="sv-form-actions">
                            <button
                                type="submit"
                                className="sv-btn sv-btn-primary"
                                disabled={saving}
                            >
                                <Icon name="check" size={16} />
                                {saving ? "Saving…" : "Save changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default Profile;
