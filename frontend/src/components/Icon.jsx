function Icon({ name, className = "sv-icon", size = 20 }) {
    const paths = {
        dashboard:
            "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
        vault:
            "M5 7.5 12 4l7 3.5v9L12 20l-7-3.5zM5 7.5l7 3.5 7-3.5M12 11v9M9 13.5h6",
        shared:
            "M8 8h8m0 0-3-3m3 3-3 3M16 16H8m0 0 3-3m-3 3 3 3",
        generator: "m13 3-8 10h6l-1 8 8-11h-6z",
        health:
            "M20 12a8 8 0 1 1-2.3-5.7M12 7v5l3 2M4 12h2m12 0h2",
        trash:
            "M5 7h14m-9 4v5m4-5v5M9 7V4h6v3m-9 0 1 13h10l1-13",
        security:
            "M12 3 20 6v5c0 5-3.4 8.3-8 10-4.6-1.7-8-5-8-10V6zM9 12l2 2 4-4",
        activity: "M4 12h3l2-6 4 12 2-6h5",
        alerts: "M12 4 21 20H3zM12 10v4m0 3h.01",
        profile:
            "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
        password: "M7 10V8a5 5 0 0 1 10 0v2m-11 0h12v10H6z",
        devices: "M4 5h16v11H4zM8 20h8m-4-4v4",
        admin: "M4 20V8l8-5 8 5v12M8 20v-6h8v6M12 3v5",
        users:
            "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m8-9a4 4 0 1 0 0-8 4 4 0 0 0 0 8m5-7a3 3 0 0 1 0 6m2 10v-1a4 4 0 0 0-3-3",
        search: "m20 20-4.2-4.2M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z",
        plus: "M12 5v14M5 12h14",
        refresh:
            "M20 11a8 8 0 0 0-14.7-4M4 5v4h4M4 13a8 8 0 0 0 14.7 4M20 19v-4h-4",
        eye:
            "M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Zm10 2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
        edit:
            "M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4ZM13.5 6.5l4 4",
        share:
            "M12 16V4m0 0L8 8m4-4 4 4M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5",
        star:
            "m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z",
        arrowRight: "M4 12h15m0 0-5-5m5 5-5 5",
        arrowUpRight: "M7 17 17 7m0 0H8m9 0v9",
        check: "m5 12 4 4L19 6",
        warning: "M12 4 21 20H3zM12 10v4m0 3h.01",
        close: "M6 6l12 12M18 6 6 18",
        lock: "M7 10V8a5 5 0 0 1 10 0v2m-11 0h12v10H6z",
        external: "M14 4h6v6m0-6L10 14M20 14v6H4V4h6",
        download: "M12 4v12m0 0-4-4m4 4 4-4M5 20h14",
        shield:
            "M12 2.8 20 6v5.6c0 4.8-3.3 8-8 9.6-4.7-1.6-8-4.8-8-9.6V6z",
        clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2",
        filter: "M4 6h16M7 12h10M10 18h4",
        user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0",
        key: "M14 10a4 4 0 1 1-3.4-3.9L16 2h3v3h-2v3h-2v2h-1Z",
        monitor: "M4 5h16v11H4zM8 20h8m-4-4v4",
    };

    return (
        <svg
            className={className}
            width={size}
            height={size}
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

export default Icon;
