import { useEffect, useState } from "react";

import {
    getAuditLogs,
    downloadAuditReportPdf,
    downloadAuditReportExcel,
} from "../services/adminService";
import Icon from "./Icon";

function AuditLogs() {
    const [auditLogs, setAuditLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [downloadingExcel, setDownloadingExcel] = useState(false);

    // =========================================================
    // LOAD AUDIT LOGS
    // =========================================================

    useEffect(() => {
        loadAuditLogs();
        // Audit logs are loaded once while the page is mounted.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadAuditLogs = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            setError("");

            const response = await getAuditLogs();

            setAuditLogs(Array.isArray(response) ? response : []);
        } catch (err) {
            console.error("Unable to load audit logs:", err);

            setError(
                err.response?.data?.message || "Unable to load audit logs.",
            );
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // =========================================================
    // DOWNLOAD AUDIT PDF
    // =========================================================

    const handleDownloadPdf = async () => {
        try {
            setDownloadingPdf(true);
            setError("");

            const pdfBlob = await downloadAuditReportPdf();

            const url = window.URL.createObjectURL(
                new Blob([pdfBlob], {
                    type: "application/pdf",
                }),
            );

            const link = document.createElement("a");

            link.href = url;
            link.download = "audit-report.pdf";

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Audit PDF error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to download audit PDF.",
            );
        } finally {
            setDownloadingPdf(false);
        }
    };

    // =========================================================
    // DOWNLOAD AUDIT EXCEL
    // =========================================================

    const handleDownloadExcel = async () => {
        try {
            setDownloadingExcel(true);
            setError("");

            const excelBlob = await downloadAuditReportExcel();

            const url = window.URL.createObjectURL(
                new Blob([excelBlob], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }),
            );

            const link = document.createElement("a");

            link.href = url;
            link.download = "audit-report.xlsx";

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Audit Excel error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to download audit Excel.",
            );
        } finally {
            setDownloadingExcel(false);
        }
    };

    // =========================================================
    // SEARCH
    // =========================================================

    const searchValue = search.toLowerCase().trim();

    const filteredLogs = auditLogs.filter((log) => {
        if (!searchValue) {
            return true;
        }

        return (
            log.action?.toLowerCase().includes(searchValue) ||
            log.entityType?.toLowerCase().includes(searchValue) ||
            String(log.entityId).includes(searchValue) ||
            log.performedBy?.toLowerCase().includes(searchValue)
        );
    });

    // =========================================================
    // FORMAT ACTION
    // =========================================================

    const formatAction = (action) => {
        if (!action) {
            return "Unknown Action";
        }

        return action
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (character) => character.toUpperCase());
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <section className="sv-page-stack">
                <header className="sv-page-header">
                    <div>
                        <span className="sv-eyebrow">Administration</span>
                        <h1>Audit Logs</h1>
                        <p>Loading audit entries…</p>
                    </div>
                </header>

                <div className="sv-loading-panel" role="status">
                    <span className="sv-loading-bar" aria-hidden="true" />
                    Loading audit logs…
                </div>
            </section>
        );
    }

    return (
        <section className="sv-page-stack">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Administration</span>
                    <h1>Audit Logs</h1>
                    <p>
                        Credential and security operations recorded across
                        SecureVault.
                    </p>
                </div>

                <div className="sv-header-actions">
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadAuditLogs(false)}
                        disabled={refreshing}
                    >
                        <Icon name="refresh" size={16} />
                        {refreshing ? "Refreshing…" : "Refresh"}
                    </button>

                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={handleDownloadPdf}
                        disabled={downloadingPdf}
                    >
                        <Icon name="download" size={16} />
                        {downloadingPdf ? "Downloading…" : "PDF"}
                    </button>

                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={handleDownloadExcel}
                        disabled={downloadingExcel}
                    >
                        <Icon name="download" size={16} />
                        {downloadingExcel ? "Downloading…" : "Excel"}
                    </button>
                </div>
            </header>

            {error && (
                <div className="sv-inline-error" role="alert">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={() => loadAuditLogs()}
                    >
                        Try again
                    </button>
                </div>
            )}

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
                            placeholder="Search action, entity or user"
                            aria-label="Search audit logs"
                        />
                    </label>

                    <span className="sv-toolbar-count">
                        {filteredLogs.length}{" "}
                        {filteredLogs.length === 1 ? "entry" : "entries"}
                    </span>
                </div>

                {filteredLogs.length === 0 ? (
                    <div className="sv-empty-state">
                        <div>
                            <h3>No audit activity found</h3>
                            <p>
                                {searchValue
                                    ? "Try a different search term."
                                    : "There are no recorded audit entries."}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="sv-table-scroll">
                        <table className="sv-data-table">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Entity</th>
                                    <th>Entity ID</th>
                                    <th>Performed by</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredLogs.map((log) => (
                                    <tr key={log.id}>
                                        <td>
                                            <span className="sv-action-tag">
                                                {formatAction(log.action)}
                                            </span>
                                        </td>

                                        <td>{log.entityType || "—"}</td>

                                        <td>{log.entityId ?? "—"}</td>

                                        <td>{log.performedBy || "—"}</td>

                                        <td>
                                            {log.timestamp
                                                ? new Date(
                                                      log.timestamp,
                                                  ).toLocaleString()
                                                : "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </section>
    );
}

export default AuditLogs;
