import { useState } from "react";

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
            icon: "▣",
        },
        {
            id: "shared",
            label: "Shared With Me",
            icon: "⇄",
        },
        {
            id: "generator",
            label: "Password Generator",
            icon: "✦",
        },
        {
            id: "health",
            label: "Password Health",
            icon: "♥",
        },
        {
            id: "trash",
            label: "Trash",
            icon: "⌫",
        },
    ];


    // =========================================================
    // SECURITY
    // =========================================================

    const securityItems = [
        {
            id: "security",
            label: "Security Overview",
            icon: "◈",
        },
        {
            id: "activity",
            label: "Login Activity",
            icon: "◷",
        },
        {
            id: "alerts",
            label: "Security Alerts",
            icon: "!",
        },
    ];


    // =========================================================
    // ACCOUNT
    // =========================================================

    const accountItems = [
        {
            id: "profile",
            label: "Profile",
            icon: "♙",
        },
        {
            id: "change-password",
            label: "Change Password",
            icon: "⌑",
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: "●",
        },
        {
            id: "devices",
            label: "Devices",
            icon: "▤",
        },
    ];


    // =========================================================
    // ADMIN
    // =========================================================

    const adminItems = [
        {
            id: "admin",
            label: "Admin Dashboard",
            icon: "▥",
        },
        {
            id: "users",
            label: "User Management",
            icon: "♙",
        },
        {
            id: "audit",
            label: "Audit Logs",
            icon: "≡",
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
                ☰
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
                            ◉
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
                                {item.icon}
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
                                    {item.icon}
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
                                {item.icon}
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
                                        {item.icon}
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

                        <span>
                            ↪
                        </span>

                        Logout

                    </button>

                </div>

            </aside>
        </>
    );
}

export default AppSidebar;