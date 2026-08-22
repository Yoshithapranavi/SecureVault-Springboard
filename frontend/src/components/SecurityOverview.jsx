import { useEffect, useState } from "react";

import {
    getSecuritySummary,
    downloadSecurityReportPdf,
    downloadSecurityReportExcel,
} from "../services/adminService";

function SecurityOverview({ isAdmin }) {

    const [summary, setSummary] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [downloadingPdf, setDownloadingPdf] =
        useState(false);
    const [downloadingExcel, setDownloadingExcel] =
        useState(false);

    const [error, setError] =
        useState("");


    // =========================================================
    // LOAD SECURITY SUMMARY
    // =========================================================

    useEffect(() => {

        if (!isAdmin) {

            setLoading(false);

            return;
        }

        loadSummary();

    }, [isAdmin]);


    const loadSummary = async (
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
                await getSecuritySummary();

            setSummary(
                response || {}
            );

        } catch (err) {

            console.error(
                "Security summary error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load security summary."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);
        }
    };


    // =========================================================
    // DOWNLOAD SECURITY REPORT PDF
    // =========================================================

    const handleDownloadPdf = async () => {

        try {

            setDownloadingPdf(true);

            setError("");

            const pdfBlob =
                await downloadSecurityReportPdf();

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
                "securevault-security-report.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(
                "Security report PDF error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to download security report."
            );

        } finally {

            setDownloadingPdf(false);
        }
    };
    // =========================================================
    // DOWNLOAD SECURITY REPORT EXCEL
    // =========================================================

    const handleDownloadExcel = async () => {

        try {

            setDownloadingExcel(true);

            setError("");

            const excelBlob =
                await downloadSecurityReportExcel();

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
                "securevault-security-report.xlsx";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(
                "Security report Excel error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to download security report."
            );

        } finally {

            setDownloadingExcel(false);
        }
    };
    // =========================================================
    // ACCESS
    // =========================================================

    if (!isAdmin) {

        return (

            <section className="content-page">

                <div className="empty-state">

                    <h2>
                        Security Overview
                    </h2>

                    <p>
                        Security monitoring information
                        is available to administrators.
                    </p>

                </div>

            </section>
        );
    }


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <section className="content-page">

                <div className="page-loading">
                    Loading security overview...
                </div>

            </section>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <section className="content-page">

                <div className="error-message">

                    <span>
                        {error}
                    </span>

                    <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                            loadSummary()
                        }
                    >
                        Try again
                    </button>

                </div>

            </section>
        );
    }


    // =========================================================
    // SAFE VALUES
    // =========================================================

    const totalEvents =
        Number(
            summary?.totalSecurityEvents
        ) || 0;

    const successfulLogins =
        Number(
            summary?.successfulLogins
        ) || 0;

    const failedLogins =
        Number(
            summary?.failedLogins
        ) || 0;

    const highRiskEvents =
        Number(
            summary?.highRiskEvents
        ) || 0;

    const mediumRiskEvents =
        Number(
            summary?.mediumRiskEvents
        ) || 0;

    const unresolvedAlerts =
        Number(
            summary?.unresolvedAlerts
        ) || 0;


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
                        Security Overview
                    </h1>

                    <p>
                        Current system security statistics.
                    </p>

                </div>


                <div className="page-actions">

                    <button
                        type="button"
                        className="text-button"
                        onClick={() =>
                            loadSummary(false)
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

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="security-stats">


                <div className="security-stat">

                    <span>
                        Total Events
                    </span>

                    <strong>
                        {totalEvents}
                    </strong>

                </div>


                <div className="security-stat success">

                    <span>
                        Successful Logins
                    </span>

                    <strong>
                        {successfulLogins}
                    </strong>

                </div>


                <div className="security-stat danger">

                    <span>
                        Failed Logins
                    </span>

                    <strong>
                        {failedLogins}
                    </strong>

                </div>


                <div className="security-stat danger">

                    <span>
                        High Risk
                    </span>

                    <strong>
                        {highRiskEvents}
                    </strong>

                </div>


                <div className="security-stat warning">

                    <span>
                        Medium Risk
                    </span>

                    <strong>
                        {mediumRiskEvents}
                    </strong>

                </div>


                <div className="security-stat warning">

                    <span>
                        Unresolved Alerts
                    </span>

                    <strong>
                        {unresolvedAlerts}
                    </strong>

                </div>

            </div>


            {/* =================================================
                SECURITY STATUS
            ================================================= */}

            <div className="security-status-panel">

                <div>

                    <span className="eyebrow">
                        CURRENT STATUS
                    </span>

                    <h2>
                        {unresolvedAlerts === 0
                            ? "No unresolved security alerts"
                            : `${unresolvedAlerts} unresolved security alert${unresolvedAlerts === 1 ? "" : "s"}`}
                    </h2>

                    <p>
                        Review the security alerts section
                        for more details about detected activity.
                    </p>

                </div>

            </div>

        </section>
    );
}


export default SecurityOverview;