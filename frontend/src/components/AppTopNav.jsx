import { useEffect, useRef, useState } from "react";

import Icon from "./Icon";

const NAV_GROUPS = [
    {
        label: "Workspace",
        items: [
            { id: "dashboard", label: "Dashboard", icon: "dashboard" },
            { id: "vault", label: "Password Vault", icon: "vault" },
            { id: "shared", label: "Shared With Me", icon: "shared" },
            { id: "generator", label: "Password Generator", icon: "generator" },
            { id: "health", label: "Password Health", icon: "health" },
            { id: "trash", label: "Trash", icon: "trash" },
        ],
    },
    {
        label: "Security",
        items: [
            { id: "security", label: "Security Overview", icon: "security", adminOnly: true },
            { id: "activity", label: "Login Activity", icon: "activity" },
            { id: "alerts", label: "Security Alerts", icon: "alerts" },
        ],
    },
    {
        label: "Account",
        items: [
            { id: "profile", label: "Profile", icon: "profile" },
            { id: "change-password", label: "Change Password", icon: "password" },
            { id: "notifications", label: "Notifications", icon: "notifications" },
            { id: "devices", label: "Devices", icon: "devices" },
        ],
    },
];

const ACCOUNT_NAV_ITEMS = [
    { id: "profile", label: "Profile" },
    { id: "change-password", label: "Change Password" },
    { id: "notifications", label: "Notifications" },
    { id: "devices", label: "Devices" },
];

function TopNav({ user, isAdmin, activeSection, onNavigate, onLogout }) {
    const [openGroup, setOpenGroup] = useState(null);
    const [accountOpen, setAccountOpen] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const accountRef = useRef(null);
    const mobilePanelRef = useRef(null);

    const groups = NAV_GROUPS.map((group) => ({
        ...group,
        items: group.items.filter((item) => !item.adminOnly || isAdmin),
    })).filter((group) => group.items.length > 0);

    const initials =
        user?.name
            ?.split(" ")
            .map((part) => part.charAt(0))
            .join("")
            .slice(0, 2)
            .toUpperCase() || "SV";

    const handleNavigate = (section) => {
        onNavigate(section);
        setOpenGroup(null);
        setMobileNavOpen(false);
        setAccountOpen(false);
    };

    useEffect(() => {
        if (!accountOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setAccountOpen(false);
            }
        };

        const handlePointerDown = (event) => {
            if (accountRef.current && !accountRef.current.contains(event.target)) {
                setAccountOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handlePointerDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handlePointerDown);
        };
    }, [accountOpen]);

    useEffect(() => {
        if (!mobileNavOpen) {
            return undefined;
        }

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setMobileNavOpen(false);
            }
        };

        const handlePointerDown = (event) => {
            if (mobilePanelRef.current && !mobilePanelRef.current.contains(event.target)) {
                setMobileNavOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handlePointerDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handlePointerDown);
        };
    }, [mobileNavOpen]);

    const renderNavItem = (item, isActive) => (
        <button
            key={item.id}
            type="button"
            className={`sv-topnav-item ${isActive ? "is-active" : ""}`}
            onClick={() => handleNavigate(item.id)}
        >
            <span className="sv-nav-icon" aria-hidden="true">
                <Icon name={item.icon || "chevron"} size={16} />
            </span>
            <span className="sv-nav-text">{item.label}</span>
            <span className="sv-nav-active-mark" aria-hidden="true" />
        </button>
    );

    return (
        <header className="sv-topnav">
            <div className="sv-topnav-brand">
                <span className="sv-topnav-brand-mark" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 2.8 20 6v5.6c0 4.8-3.3 8-8 9.6-4.7-1.6-8-4.8-8-9.6V6z"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinejoin="round"
                        />
                        <path
                            d="m8.8 11.8 2.1 2.1 4.4-4.4"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
                <div className="sv-topnav-brand-copy">
                    <strong>SecureVault</strong>
                    <span>Credential security</span>
                </div>
            </div>

            <nav className="sv-topnav-nav" aria-label="Primary navigation">
                {groups.map((group) => {
                    const isGroupOpen = openGroup === group.label;
                    const groupHasActive = group.items.some(
                        (item) => item.id === activeSection,
                    );

                    return (
                        <div className="sv-topnav-group" key={group.label}>
                            <button
                                type="button"
                                className={`sv-topnav-group-button ${isGroupOpen ? "is-open" : ""} ${groupHasActive ? "is-active-group" : ""}`}
                                aria-expanded={isGroupOpen}
                                aria-haspopup="menu"
                                onClick={() => setOpenGroup(isGroupOpen ? null : group.label)}
                            >
                                {group.label}
                                <span className="sv-nav-icon" aria-hidden="true">
                                    <Icon name="chevron" size={14} />
                                </span>
                            </button>

                            {isGroupOpen && (
                                <div className="sv-topnav-group-menu" role="menu">
                                    {group.items.map((item) =>
                                        renderNavItem(item, activeSection === item.id),
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            <div className="sv-topnav-actions">
                <button
                    type="button"
                    className="sv-topnav-menu-button"
                    aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
                    aria-expanded={mobileNavOpen}
                    aria-controls="securevault-navigation"
                    onClick={() => setMobileNavOpen((open) => !open)}
                >
                    <span className="sv-topnav-menu-glyph" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                    </span>
                </button>

                <div className="sv-topnav-account" ref={accountRef}>
                    <button
                        type="button"
                        className="sv-topnav-account-button"
                        aria-haspopup="menu"
                        aria-expanded={accountOpen}
                        onClick={() => setAccountOpen((open) => !open)}
                    >
                        <span className="sv-avatar">{initials}</span>
                        <span className="sv-topnav-account-copy">
                            <strong>{user?.name || "SecureVault user"}</strong>
                            <span>{isAdmin ? "Administrator" : "Member"}</span>
                        </span>
                        <span className="sv-topnav-account-chevron" aria-hidden="true">
                            <Icon name="chevron" size={14} />
                        </span>
                    </button>

                    {accountOpen && (
                        <div className="sv-topnav-account-menu" role="menu">
                            {ACCOUNT_NAV_ITEMS.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    role="menuitem"
                                    className="sv-topnav-item"
                                    onClick={() => handleNavigate(item.id)}
                                >
                                    <span className="sv-nav-text">{item.label}</span>
                                    <span className="sv-nav-active-mark" aria-hidden="true" />
                                </button>
                            ))}
                            <button
                                type="button"
                                className="sv-topnav-logout-button"
                                onClick={() => {
                                    setAccountOpen(false);
                                    onLogout();
                                }}
                            >
                                <span className="sv-nav-icon" aria-hidden="true">
                                    <Icon name="logout" size={16} />
                                </span>
                                Sign out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {mobileNavOpen && (
                <nav
                    className="sv-topnav-mobile-panel is-open"
                    aria-label="Primary navigation"
                    ref={mobilePanelRef}
                >
                    {groups.map((group) => (
                        <div className="sv-topnav-mobile-group" key={group.label}>
                            <div className="sv-topnav-mobile-group-label">{group.label}</div>
                            {group.items.map((item) =>
                                renderNavItem(item, activeSection === item.id),
                            )}
                        </div>
                    ))}
                </nav>
            )}
        </header>
    );
}

export default TopNav;
