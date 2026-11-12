import { useEffect, useState } from "react";

import { getAllUsers } from "../services/adminService";
import Icon from "./Icon";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");

    // =========================================================
    // LOAD USERS
    // =========================================================

    useEffect(() => {
        loadUsers();
        // Users are loaded once while the page is mounted.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadUsers = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response = await getAllUsers();

            setUsers(
                Array.isArray(response?.data) ? response.data : [],
            );
        } catch (err) {
            console.error("Unable to load users:", err);

            setError(
                err.response?.data?.message || "Unable to load users.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const searchValue = search.toLowerCase().trim();

    const filteredUsers = users.filter((user) => {
        if (!searchValue) {
            return true;
        }

        return (
            user.name?.toLowerCase().includes(searchValue) ||
            user.email?.toLowerCase().includes(searchValue) ||
            String(user.id).includes(searchValue)
        );
    });

    const adminCount = users.filter(
        (user) => user.role === "ADMIN",
    ).length;

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <section className="sv-page-stack">
                <header className="sv-page-header">
                    <div>
                        <span className="sv-eyebrow">Administration</span>
                        <h1>User Management</h1>
                        <p>Loading registered users…</p>
                    </div>
                </header>

                <div className="sv-loading-panel" role="status">
                    <span className="sv-loading-bar" aria-hidden="true" />
                    Loading users…
                </div>
            </section>
        );
    }

    return (
        <section className="sv-page-stack">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Administration</span>
                    <h1>User Management</h1>
                    <p>
                        Registered SecureVault accounts, their roles and
                        registration dates.
                    </p>
                </div>

                <div className="sv-header-actions">
                    <span className="sv-status-chip neutral">
                        {users.length} total · {adminCount} admin
                    </span>

                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadUsers(false)}
                        disabled={refreshing}
                    >
                        <Icon name="refresh" size={16} />
                        {refreshing ? "Refreshing…" : "Refresh"}
                    </button>
                </div>
            </header>

            {error && (
                <div className="sv-inline-error" role="alert">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadUsers()}
                    >
                        Try again
                    </button>
                </div>
            )}

            {users.length === 0 ? (
                <div className="sv-empty-state large">
                    <span className="sv-empty-icon" aria-hidden="true">
                        <Icon name="users" size={22} />
                    </span>
                    <div>
                        <h2>No users found</h2>
                        <p>There are no registered users to display.</p>
                    </div>
                </div>
            ) : (
                <div className="sv-table-shell">
                    <div className="sv-table-toolbar">
                        <label className="sv-search-field">
                            <Icon name="search" size={15} />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search by name, email or user ID"
                                aria-label="Search users"
                            />
                        </label>

                        <span className="sv-toolbar-count">
                            {filteredUsers.length}{" "}
                            {filteredUsers.length === 1 ? "user" : "users"}
                        </span>
                    </div>

                    {filteredUsers.length === 0 ? (
                        <div className="sv-empty-state">
                            <div>
                                <h3>No matching users</h3>
                                <p>Try a different search term.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="sv-table-scroll">
                            <table className="sv-data-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>User</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Registered</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredUsers.map((user) => {
                                        const name =
                                            user.name || "Unknown User";

                                        const initial = name
                                            .charAt(0)
                                            .toUpperCase();

                                        return (
                                            <tr key={user.id}>
                                                <td>#{user.id}</td>

                                                <td>
                                                    <div className="sv-table-user">
                                                        <span
                                                            className="sv-table-avatar"
                                                            aria-hidden="true"
                                                        >
                                                            {initial}
                                                        </span>
                                                        <strong>{name}</strong>
                                                    </div>
                                                </td>

                                                <td>{user.email || "—"}</td>

                                                <td>
                                                    <span
                                                        className={`sv-role-badge ${user.role === "ADMIN" ? "admin" : ""}`}
                                                    >
                                                        {user.role || "USER"}
                                                    </span>
                                                </td>

                                                <td>
                                                    {user.createdAt
                                                        ? new Date(
                                                              user.createdAt,
                                                          ).toLocaleDateString()
                                                        : "—"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}

export default AdminUsers;
