import { useEffect, useState } from "react";

import {
    getProfile,
    updateProfile,
} from "../services/profileService";

function Profile() {

    const [profile, setProfile] =
        useState(null);

    const [name, setName] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    useEffect(() => {

        loadProfile();

    }, []);


    const loadProfile = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getProfile();

            if (response?.success) {

                setProfile(response.data);

                setName(
                    response.data?.name || ""
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to load profile."
                );
            }

        } catch (err) {

            console.error(
                "Profile loading error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load profile."
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

            setError(
                "Name is required."
            );

            return;
        }

        try {

            setSaving(true);

            const response =
                await updateProfile({
                    name: name.trim(),
                });

            if (response?.success) {

                setProfile(response.data);

                setName(
                    response.data?.name || ""
                );

                setSuccess(
                    response.message ||
                    "Profile updated successfully."
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to update profile."
                );
            }

        } catch (err) {

            console.error(
                "Profile update error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to update profile."
            );

        } finally {

            setSaving(false);
        }
    };


    if (loading) {

        return (
            <section className="content-page">
                <div className="page-loading">
                    Loading profile...
                </div>
            </section>
        );
    }


    return (

        <section className="content-page">

            <div className="page-heading">

                <div>

                    <span className="eyebrow">
                        ACCOUNT
                    </span>

                    <h1>
                        My Profile
                    </h1>

                    <p>
                        Manage your SecureVault
                        account information.
                    </p>

                </div>

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


            <div className="profile-card">

                <form onSubmit={handleSubmit}>

                    <div className="detail-group">

                        <label>
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            disabled={saving}
                        />

                    </div>


                    <div className="detail-group">

                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            value={
                                profile?.email || ""
                            }
                            readOnly
                        />

                    </div>


                    <div className="detail-group">

                        <label>
                            Role
                        </label>

                        <input
                            type="text"
                            value={
                                profile?.role || "USER"
                            }
                            readOnly
                        />

                    </div>


                    <div className="modal-actions">

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"}
                        </button>

                    </div>

                </form>

            </div>

        </section>
    );
}

export default Profile;