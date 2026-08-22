import { useEffect, useState } from "react";

import {
    getAuditLogs,
    downloadAuditReportPdf,
    downloadAuditReportExcel,
} from "../services/adminService";


function AuditLogs() {

    const [auditLogs, setAuditLogs] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");
    const [downloadingPdf, setDownloadingPdf] =
        useState(false);

    const [downloadingExcel, setDownloadingExcel] =
        useState(false);

    // =========================================================
    // LOAD AUDIT LOGS
    // =========================================================

    useEffect(() => {

        loadAuditLogs();

    }, []);


    const loadAuditLogs = async (
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
                await getAuditLogs();

            setAuditLogs(
                Array.isArray(response)
                    ? response
                    : []
            );

        } catch (err) {

            console.error(
                "Unable to load audit logs:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load audit logs."
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

            const pdfBlob =
                await downloadAuditReportPdf();

            const url =
                window.URL.createObjectURL(
                    new Blob(
                        [pdfBlob],
                        {
                            type: "application/pdf",
                        }
                    )
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "audit-report.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(
                "Audit PDF error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to download audit PDF."
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

            const excelBlob =
                await downloadAuditReportExcel();

            const url =
                window.URL.createObjectURL(
                    new Blob(
                        [excelBlob],
                        {
                            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        }
                    )
                );

            const link =
                document.createElement("a");

            link.href = url;

            link.download =
                "audit-report.xlsx";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(
                "Audit Excel error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to download audit Excel."
            );

        } finally {

            setDownloadingExcel(false);
        }
    };


    // =========================================================
    // SEARCH
    // =========================================================

    const searchValue =
        search.toLowerCase().trim();


    const filteredLogs =
        auditLogs.filter(
            (log) => {

                if (!searchValue) {
                    return true;
                }

                return (
                    log.action
                        ?.toLowerCase()
                        .includes(searchValue)
                    ||
                    log.entityType
                        ?.toLowerCase()
                        .includes(searchValue)
                    ||
                    String(
                        log.entityId
                    ).includes(searchValue)
                    ||
                    log.performedBy
                        ?.toLowerCase()
                        .includes(searchValue)
                );
            }
        );


    // =========================================================
    // FORMAT ACTION
    // =========================================================

    const formatAction = (
        action
    ) => {

        if (!action) {
            return "Unknown Action";
        }

        return action
            .replaceAll("_", " ")
            .toLowerCase()
            .replace(
                /\b\w/g,
                character =>
                    character.toUpperCase()
            );
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <section className="content-page">

                <div className="page-loading">
                    Loading audit logs...
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
                        SECURITY
                    </span>

                    <h1>
                        Audit Logs
                    </h1>

                    <p>
                        Review credential and security
                        operations performed in SecureVault.
                    </p>

                </div>


                <button
                    type="button"
                    className="text-button"
                    onClick={() =>
                        loadAuditLogs(false)
                    }
                    disabled={refreshing}
                >
                    {refreshing
                        ? "Refreshing..."
                        : "Refresh"}
                </button>
                <button
                    type="button"
                    className="text-button"
                    onClick={handleDownloadPdf}
                    disabled={downloadingPdf}
                >
                    {downloadingPdf
                        ? "Downloading..."
                        : "Download PDF"}
                </button>

                <button
                    type="button"
                    className="text-button"
                    onClick={handleDownloadExcel}
                    disabled={downloadingExcel}
                >
                    {downloadingExcel
                        ? "Downloading..."
                        : "Download Excel"}
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
                            loadAuditLogs()
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
                    placeholder="Search action, entity or user..."
                    className="admin-user-search"
                />


                <span className="admin-user-count">

                    {filteredLogs.length}
                    {" "}
                    {filteredLogs.length === 1
                        ? "entry"
                        : "entries"}

                </span>

            </div>


            {/* =================================================
                EMPTY
            ================================================= */}

            {filteredLogs.length === 0 ? (

                <div className="empty-state">

                    <h3>
                        No audit activity found
                    </h3>

                    <p>
                        {searchValue
                            ? "Try a different search term."
                            : "There are no recorded audit entries."}
                    </p>

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

                            {filteredLogs.map(
                                (log) => (

                                    <tr
                                        key={
                                            log.id
                                        }
                                    >

                                        <td>

                                            <span className="audit-action">
                                                {formatAction(
                                                    log.action
                                                )}
                                            </span>

                                        </td>


                                        <td>
                                            {log.entityType ||
                                                "—"}
                                        </td>


                                        <td>
                                            {log.entityId ??
                                                "—"}
                                        </td>


                                        <td>
                                            {log.performedBy ||
                                                "—"}
                                        </td>


                                        <td>

                                            {log.timestamp
                                                ? new Date(
                                                    log.timestamp
                                                ).toLocaleString()
                                                : "—"}

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}

        </section>
    );
}


export default AuditLogs;