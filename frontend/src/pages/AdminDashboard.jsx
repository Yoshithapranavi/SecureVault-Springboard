import { useEffect, useState } from "react";

import {
    getSecuritySummary,
    getAuditLogs,
    getAllUsers,
} from "../services/adminService";

import { useAuth } from "../context/AuthContext";

import SecurityAlerts from "../components/SecurityAlerts";


function AdminDashboard({
    onGoToVault,
    onLogout,
    initialSection = "dashboard",
}) {



    const [summary, setSummary] = useState(null);
    const [auditLogs, setAuditLogs] = useState([]);
    const [users, setUsers] = useState([]);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // LOAD ALL ADMIN DATA
    // =========================================================

    useEffect(() => {
        loadAdminData();
    }, []);


    const loadAdminData = async () => {

        try {

            setLoading(true);
            setError("");

            const summaryResponse =
                await getSecuritySummary();

            const auditResponse =
                await getAuditLogs();

            const usersResponse =
                await getAllUsers();


            console.log(
                "ADMIN SUMMARY:",
                summaryResponse
            );

            console.log(
                "ADMIN AUDIT:",
                auditResponse
            );

            console.log(
                "ADMIN USERS:",
                usersResponse
            );


            setSummary(
                summaryResponse
            );


            setAuditLogs(
                Array.isArray(auditResponse)
                    ? auditResponse
                    : []
            );


            setUsers(
                usersResponse?.data || []
            );

        } catch (err) {

            console.error(
                "Admin dashboard error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load admin dashboard."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // LOGOUT
    // =========================================================
    const handleLogout = () => {
        onLogout();
    };


    // =========================================================
    // SEARCH USERS
    // =========================================================

    const filteredUsers = users.filter((user) => {

        const value =
            search.toLowerCase().trim();


        return (
            String(user.id)
                .includes(value)

            ||

            user.name
                ?.toLowerCase()
                .includes(value)

            ||

            user.email
                ?.toLowerCase()
                .includes(value)
        );
    });


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="admin-page">

                <div className="admin-loading">

                    Loading admin dashboard...

                </div>

            </div>
        );
    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="admin-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="admin-header">

                <div>

                    <h1>
                        SecureVault Admin
                    </h1>

                    <p>
                        Security and system overview
                    </p>

                </div>


                <div className="admin-header-actions">

                    <button
                        className="vault-nav-button"
                        type="button"
                        onClick={onGoToVault}
                    >
                        My Vault
                    </button>

                    <button
                        className="logout-button"
                        type="button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>


            <main className="admin-container">


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="admin-page-error">

                        {error}

                    </div>

                )}


                {/* =================================================
                    SECURITY OVERVIEW
                ================================================= */}

                <section className="admin-section">


                    <div className="section-heading">

                        <h2>
                            Security Overview
                        </h2>

                        <p>
                            Current system security statistics
                        </p>

                    </div>


                    <div className="admin-stat-grid">


                        {/* TOTAL EVENTS */}

                        <div className="admin-stat-card">

                            <span>
                                Total Security Events
                            </span>

                            <strong>
                                {summary?.totalSecurityEvents ?? 0}
                            </strong>

                        </div>


                        {/* SUCCESSFUL LOGINS */}

                        <div className="admin-stat-card">

                            <span>
                                Successful Logins
                            </span>

                            <strong>
                                {summary?.successfulLogins ?? 0}
                            </strong>

                        </div>


                        {/* FAILED LOGINS */}

                        <div className="admin-stat-card">

                            <span>
                                Failed Logins
                            </span>

                            <strong>
                                {summary?.failedLogins ?? 0}
                            </strong>

                        </div>


                        {/* HIGH RISK */}

                        <div className="admin-stat-card">

                            <span>
                                High Risk Events
                            </span>

                            <strong>
                                {summary?.highRiskEvents ?? 0}
                            </strong>

                        </div>


                        {/* MEDIUM RISK */}

                        <div className="admin-stat-card">

                            <span>
                                Medium Risk Events
                            </span>

                            <strong>
                                {summary?.mediumRiskEvents ?? 0}
                            </strong>

                        </div>


                        {/* UNRESOLVED ALERTS */}

                        <div className="admin-stat-card">

                            <span>
                                Unresolved Alerts
                            </span>

                            <strong>
                                {summary?.unresolvedAlerts ?? 0}
                            </strong>

                        </div>

                    </div>

                </section>



                {/* =================================================
                    USER MANAGEMENT
                ================================================= */}

                <section className="admin-section">


                    <div className="admin-users-heading">


                        <div>

                            <h2>
                                User Management
                            </h2>

                            <p>
                                View all registered SecureVault users
                            </p>

                        </div>


                        <div className="admin-user-count">

                            {users.length} Users

                        </div>

                    </div>



                    {/* SEARCH */}

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

                    </div>



                    {/* USER TABLE */}

                    {filteredUsers.length === 0 ? (

                        <div className="admin-empty">

                            No users found.

                        </div>

                    ) : (

                        <div className="audit-table-wrapper">


                            <table className="audit-table">


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
                                        (user) => (

                                            <tr
                                                key={user.id}
                                            >


                                                {/* ID */}

                                                <td>

                                                    #{user.id}

                                                </td>



                                                {/* USER */}

                                                <td>

                                                    <div className="admin-user-name">


                                                        <div className="admin-user-avatar">

                                                            {user.name
                                                                ?.charAt(0)
                                                                .toUpperCase()}

                                                        </div>


                                                        <span>

                                                            {user.name}

                                                        </span>


                                                    </div>

                                                </td>



                                                {/* EMAIL */}

                                                <td>

                                                    {user.email}

                                                </td>



                                                {/* ROLE */}

                                                <td>

                                                    <span
                                                        className={
                                                            user.role === "ADMIN"
                                                                ? "role-badge admin-role"
                                                                : "role-badge user-role"
                                                        }
                                                    >

                                                        {user.role}

                                                    </span>

                                                </td>



                                                {/* CREATED */}

                                                <td>

                                                    {user.createdAt

                                                        ? new Date(
                                                            user.createdAt
                                                        ).toLocaleDateString()

                                                        : "—"

                                                    }

                                                </td>


                                            </tr>

                                        )
                                    )}

                                </tbody>


                            </table>

                        </div>

                    )}

                </section>



                {/* =================================================
                    SECURITY ALERTS
                ================================================= */}

                <SecurityAlerts />



                {/* =================================================
                    RECENT AUDIT ACTIVITY
                ================================================= */}

                <section className="admin-section">


                    <div className="section-heading">

                        <h2>
                            Recent Audit Activity
                        </h2>

                        <p>
                            Latest security and credential operations
                        </p>

                    </div>



                    {auditLogs.length === 0 ? (

                        <div className="admin-empty">

                            No audit activity found.

                        </div>

                    ) : (

                        <div className="audit-table-wrapper">


                            <table className="audit-table">


                                <thead>

                                    <tr>

                                        <th>
                                            Action
                                        </th>

                                        <th>
                                            Entity
                                        </th>

                                        <th>
                                            Entity ID
                                        </th>

                                        <th>
                                            Performed By
                                        </th>

                                        <th>
                                            Timestamp
                                        </th>

                                    </tr>

                                </thead>



                                <tbody>

                                    {auditLogs
                                        .slice(0, 10)
                                        .map(
                                            (log) => (

                                                <tr
                                                    key={log.id}
                                                >


                                                    <td>

                                                        <span className="audit-action">

                                                            {log.action}

                                                        </span>

                                                    </td>


                                                    <td>

                                                        {log.entityType}

                                                    </td>


                                                    <td>

                                                        {log.entityId}

                                                    </td>


                                                    <td>

                                                        {log.performedBy}

                                                    </td>


                                                    <td>

                                                        {log.timestamp

                                                            ? new Date(
                                                                log.timestamp
                                                            ).toLocaleString()

                                                            : "—"

                                                        }

                                                    </td>


                                                </tr>

                                            )
                                        )}

                                </tbody>


                            </table>

                        </div>

                    )}

                </section>


            </main>

        </div>
    );
}


export default AdminDashboard;