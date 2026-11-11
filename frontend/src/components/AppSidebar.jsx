import { useState } from "react";

function SidebarIcon({ name }) {
    const paths = {
        dashboard: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
        vault: "M4 6.5 12 3l8 3.5v11L12 21l-8-3.5zM4 6.5l8 3.5 8-3.5M12 10v11",
        shared: "M7 7h10m0 0-3-3m3 3-3 3M17 17H7m0 0 3-3m-3 3 3 3",
        logout: "M10 17l5-5-5-5m5 5H3m9-7V4h8v16h-8v-3",
        generator: "m13 2-9 11h7l-1 9 9-12h-7z",
        health: "M20 12a8 8 0 0 1-15.3 3.2L3 12l1.7-3.2A8 8 0 0 1 20 12Z",
        trash: "M5 7h14m-9 4v5m4-5v5M9 7V4h6v3m-9 0 1 13h10l1-13",
        security: "M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6zM9 12l2 2 4-4",
        activity: "M4 12h3l2-6 4 12 2-6h5",
        alerts: "M12 4 21 20H3zM12 10v4m0 3h.01",
        profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
        password: "M7 10V8a5 5 0 0 1 10 0v2m-11 0h12v10H6z",
        notifications: "M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4",
        devices: "M4 5h16v11H4zM8 20h8m-4-4v4",
        admin: "M4 20V8l8-5 8 5v12M8 20v-6h8v6M12 3v5",
        users: "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m8-9a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-7a3 3 0 0 1 0 6m2 10v-1a4 4 0 0 0-3-3",
        audit: "M5 4h14v16H5zM8 8h8M8 12h8M8 16h5",
    };

    return (
        <svg
            className="sidebar-svg-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d={paths[name] || paths.dashboard} />
        </svg>
    );
}

function AppSidebar({
    user,
    isAdmin,
    activeSection,
    onNavigate,
    onLogout,
}) {

    const [mobileOpen, setMobileOpen] =
        useState(false);


    const handleNavigate = (section) => {

        onNavigate(section);

        setMobileOpen(false);
    };


    const initials =
        user?.name
            ?.split(" ")
            .map((part) => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase()
        || "SV";


    // =========================================================
    // VAULT
    // =========================================================

    const vaultItems = [
        {
            id: "vault",
            label: "My Vault",
            icon: "vault",
        },
        {
            id: "shared",
            label: "Shared With Me",
            icon: "shared",
        },
        {
            id: "generator",
            label: "Password Generator",
            icon: "generator",
        },
        {
            id: "health",
            label: "Password Health",
            icon: "health",
        },
        {
            id: "trash",
            label: "Trash",
            icon: "trash",
        },
    ];


    // =========================================================
    // SECURITY
    // =========================================================

    const securityItems = [
        {
            id: "security",
            label: "Security Overview",
            icon: "security",
        },
        {
            id: "activity",
            label: "Login Activity",
            icon: "activity",
        },
        {
            id: "alerts",
            label: "Security Alerts",
            icon: "alerts",
        },
    ];


    // =========================================================
    // ACCOUNT
    // =========================================================

    const accountItems = [
        {
            id: "profile",
            label: "Profile",
            icon: "profile",
        },
        {
            id: "change-password",
            label: "Change Password",
            icon: "password",
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: "notifications",
        },
        {
            id: "devices",
            label: "Devices",
            icon: "devices",
        },
    ];


    // =========================================================
    // ADMIN
    // =========================================================

    const adminItems = [
        {
            id: "admin",
            label: "Admin Dashboard",
            icon: "admin",
        },
        {
            id: "users",
            label: "User Management",
            icon: "users",
        },
        {
            id: "audit",
            label: "Audit Logs",
            icon: "audit",
        },
    ];


    return (
        <>
            {/* =================================================
                MOBILE MENU
            ================================================= */}

            <button
                className="mobile-menu-button"
                type="button"
                onClick={() =>
                    setMobileOpen(!mobileOpen)
                }
            >
                <span className="mobile-menu-glyph" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                </span>
                <span className="sr-only">
                    {mobileOpen ? "Close navigation" : "Open navigation"}
                </span>
            </button>


            {mobileOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() =>
                        setMobileOpen(false)
                    }
                />
            )}


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside
                className={`app-sidebar ${mobileOpen
                    ? "sidebar-open"
                    : ""
                    }`}
            >

                {/* =================================================
                    BRAND
                ================================================= */}

                <div className="sidebar-brand">

                    <div className="brand-mark">
                        S
                    </div>

                    <div>
                        <strong>
                            SecureVault
                        </strong>

                        <span>
                            Credential security
                        </span>
                    </div>

                </div>


                {/* =================================================
                    NAVIGATION
                ================================================= */}

                <nav className="sidebar-navigation">

                    {/* DASHBOARD */}

                    <button
                        type="button"
                        className={`sidebar-item ${activeSection === "dashboard"
                            ? "active"
                            : ""
                            }`}
                        onClick={() =>
                            handleNavigate("dashboard")
                        }
                    >

                        <span className="sidebar-icon">
                            <SidebarIcon name="dashboard" />
                        </span>

                        <span>
                            Dashboard
                        </span>

                    </button>


                    {/* =================================================
                        VAULT
                    ================================================= */}

                    <div className="sidebar-section-label">
                        VAULT
                    </div>

                    {vaultItems.map((item) => (

                        <button
                            key={item.id}
                            type="button"
                            className={`sidebar-item ${activeSection === item.id
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                handleNavigate(item.id)
                            }
                        >

                            <span className="sidebar-icon">
                                <SidebarIcon name={item.icon} />
                            </span>

                            <span>
                                {item.label}
                            </span>

                        </button>

                    ))}


                    {/* =================================================
    SECURITY
================================================= */}

                    <div className="sidebar-section-label">
                        SECURITY
                    </div>

                    {securityItems
                        .filter((item) =>
                            item.id !== "security" || isAdmin
                        )
                        .map((item) => (

                            <button
                                key={item.id}
                                type="button"
                                className={`sidebar-item ${activeSection === item.id
                                        ? "active"
                                        : ""
                                    }`}
                                onClick={() =>
                                    handleNavigate(item.id)
                                }
                            >

                                <span className="sidebar-icon">
                                    <SidebarIcon name={item.icon} />
                                </span>

                                <span>
                                    {item.label}
                                </span>

                            </button>

                        ))}


                    {/* =================================================
                        ACCOUNT
                    ================================================= */}

                    <div className="sidebar-section-label">
                        ACCOUNT
                    </div>

                    {accountItems.map((item) => (

                        <button
                            key={item.id}
                            type="button"
                            className={`sidebar-item ${activeSection === item.id
                                ? "active"
                                : ""
                                }`}
                            onClick={() =>
                                handleNavigate(item.id)
                            }
                        >

                            <span className="sidebar-icon">
                                <SidebarIcon name={item.icon} />
                            </span>

                            <span>
                                {item.label}
                            </span>

                        </button>

                    ))}


                    {/* =================================================
                        ADMIN
                    ================================================= */}

                    {isAdmin && (
                        <>
                            <div className="sidebar-section-label">
                                ADMIN
                            </div>

                            {adminItems.map((item) => (

                                <button
                                    key={item.id}
                                    type="button"
                                    className={`sidebar-item ${activeSection === item.id
                                        ? "active"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        handleNavigate(item.id)
                                    }
                                >

                                    <span className="sidebar-icon">
                                        <SidebarIcon name={item.icon} />
                                    </span>

                                    <span>
                                        {item.label}
                                    </span>

                                </button>

                            ))}

                        </>
                    )}

                </nav>


                {/* =================================================
                    USER FOOTER
                ================================================= */}

                <div className="sidebar-footer">

                    <div className="sidebar-user">

                        <div className="user-avatar">
                            {initials}
                        </div>

                        <div className="sidebar-user-info">

                            <strong>
                                {user?.name || "User"}
                            </strong>

                            <span>
                                {isAdmin
                                    ? "ADMIN"
                                    : "USER"}
                            </span>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="sidebar-logout"
                        onClick={onLogout}
                    >

                        <span className="sidebar-logout-icon" aria-hidden="true">
                            <SidebarIcon name="logout" />
                        </span>

                        Logout

                    </button>

                </div>

            </aside>
        </>
    );
}

export default AppSidebar;