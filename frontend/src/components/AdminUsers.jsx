import { useEffect, useState } from "react";

import {
    getAllUsers,
} from "../services/adminService";


function AdminUsers() {

    const [users, setUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");


    // =========================================================
    // LOAD USERS
    // =========================================================

    useEffect(() => {

        loadUsers();

    }, []);


    const loadUsers = async (
        showLoading = true
    ) => {

        try {

            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response =
                await getAllUsers();

            setUsers(
                Array.isArray(response?.data)
                    ? response.data
                    : []
            );

        } catch (err) {

            console.error(
                "Unable to load users:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load users."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    // =========================================================
    // SEARCH
    // =========================================================

    const searchValue =
        search.toLowerCase().trim();


    const filteredUsers =
        users.filter(
            (user) => {

                if (!searchValue) {
                    return true;
                }

                return (
                    user.name
                        ?.toLowerCase()
                        .includes(searchValue)
                    ||
                    user.email
                        ?.toLowerCase()
                        .includes(searchValue)
                    ||
                    String(
                        user.id
                    ).includes(searchValue)
                );
            }
        );


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <section className="content-page">

                <div className="page-loading">
                    Loading users...
                </div>

            </section>
        );
    }


    return (

        <section className="content-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="page-heading">

                <div>

                    <span className="eyebrow">
                        ADMINISTRATION
                    </span>

                    <h1>
                        User Management
                    </h1>

                    <p>
                        View registered SecureVault users.
                    </p>

                </div>


                <button
                    type="button"
                    className="text-button"
                    onClick={() =>
                        loadUsers(false)
                    }
                    disabled={refreshing}
                >
                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="error-message">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                            loadUsers()
                        }
                    >
                        Try again
                    </button>

                </div>

            )}


            {/* =================================================
                TOOLBAR
            ================================================= */}

            <div className="admin-users-toolbar">

                <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                        setSearch(
                            event.target.value
                        )
                    }
                    placeholder="Search by name, email or user ID..."
                    className="admin-user-search"
                />


                <span className="admin-user-count">

                    {filteredUsers.length}
                    {" "}
                    {filteredUsers.length === 1
                        ? "user"
                        : "users"}

                </span>

            </div>


            {/* =================================================
                EMPTY
            ================================================= */}

            {filteredUsers.length === 0 ? (

                <div className="empty-state">

                    <h3>
                        No users found
                    </h3>

                    <p>
                        {searchValue
                            ? "Try a different search term."
                            : "There are no registered users to display."}
                    </p>

                </div>

            ) : (

                <div className="audit-table-wrapper">

                    <table className="audit-table admin-users-table">

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    User
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Role
                                </th>

                                <th>
                                    Registered
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredUsers.map(
                                (user) => {

                                    const name =
                                        user.name ||
                                        "Unknown User";

                                    const initial =
                                        name
                                            .charAt(0)
                                            .toUpperCase();


                                    return (

                                        <tr
                                            key={
                                                user.id
                                            }
                                        >

                                            <td>
                                                #{user.id}
                                            </td>


                                            <td>

                                                <div className="admin-user-name">

                                                    <div className="admin-user-avatar">

                                                        {initial}

                                                    </div>

                                                    <span>
                                                        {name}
                                                    </span>

                                                </div>

                                            </td>


                                            <td>
                                                {user.email ||
                                                    "—"}
                                            </td>


                                            <td>

                                                <span
                                                    className={
                                                        user.role === "ADMIN"
                                                            ? "role-badge admin-role"
                                                            : "role-badge user-role"
                                                    }
                                                >
                                                    {user.role ||
                                                        "USER"}
                                                </span>

                                            </td>


                                            <td>

                                                {user.createdAt
                                                    ? new Date(
                                                        user.createdAt
                                                    ).toLocaleDateString()
                                                    : "—"}

                                            </td>

                                        </tr>

                                    );
                                }
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </section>
    );
}


export default AdminUsers;