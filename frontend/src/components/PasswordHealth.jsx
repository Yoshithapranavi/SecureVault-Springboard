import { useEffect, useState } from "react";
import {
    getPasswordHealth,
    downloadPasswordHealthPdf,
    downloadPasswordHealthExcel,
} from "../services/vaultService";

function PasswordHealth() {

    const [report, setReport] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");
    const [downloadingPdf, setDownloadingPdf] =
        useState(false);

    const [downloadingExcel, setDownloadingExcel] =
        useState(false);


    // =========================================================
    // LOAD HEALTH REPORT
    // =========================================================

    useEffect(() => {

        loadPasswordHealth();

    }, []);


    const loadPasswordHealth = async () => {

        try {

            setLoading(true);
            setError("");

            const response =
                await getPasswordHealth();

            if (response?.success) {

                setReport(
                    response.data
                );

            } else {

                setError(
                    response?.message ||
                    "Unable to load password health."
                );
            }

        } catch (err) {

            console.error(
                "Password health error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to load password health."
            );

        } finally {

            setLoading(false);
        }
    };

    // =========================================================
    // DOWNLOAD PASSWORD HEALTH PDF
    // =========================================================

    const handleDownloadPdf = async () => {

        try {

            setDownloadingPdf(true);
            setError("");

            const pdfBlob =
                await downloadPasswordHealthPdf();

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
                "password-health-report.pdf";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(
                "Password health PDF error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to download password health PDF."
            );

        } finally {

            setDownloadingPdf(false);
        }
    };


    // =========================================================
    // DOWNLOAD PASSWORD HEALTH EXCEL
    // =========================================================

    const handleDownloadExcel = async () => {

        try {

            setDownloadingExcel(true);
            setError("");

            const excelBlob =
                await downloadPasswordHealthExcel();

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
                "password-health-report.xlsx";

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(url);

        } catch (err) {

            console.error(
                "Password health Excel error:",
                err
            );

            setError(
                err.response?.data?.message ||
                "Unable to download password health Excel."
            );

        } finally {

            setDownloadingExcel(false);
        }
    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="password-health-card">

                <h3>
                    Password Health
                </h3>

                <p>
                    Checking your passwords...
                </p>

            </div>
        );
    }


    // =========================================================
    // ERROR
    // =========================================================

    if (error) {

        return (

            <div className="password-health-card">

                <div className="password-health-header">

                    <div>

                        <span className="eyebrow">
                            SECURITY
                        </span>

                        <h3>
                            Password Health
                        </h3>

                    </div>

                </div>


                <p className="error-message">
                    {error}
                </p>


                <button
                    type="button"
                    className="text-button"
                    onClick={loadPasswordHealth}
                >
                    Try again
                </button>

            </div>
        );
    }


    // =========================================================
    // EMPTY / NO REPORT
    // =========================================================

    if (!report) {

        return (

            <div className="password-health-card">

                <div className="password-health-header">

                    <div>

                        <span className="eyebrow">
                            SECURITY
                        </span>

                        <h3>
                            Password Health
                        </h3>

                        <p>
                            No password health data is
                            available yet.
                        </p>

                    </div>

                </div>

            </div>
        );
    }


    // =========================================================
    // SAFE VALUES
    // =========================================================

    const healthPercentage =
        Math.max(
            0,
            Math.min(
                100,
                Number(
                    report.healthPercentage
                ) || 0
            )
        );

    const totalCredentials =
        Number(
            report.totalCredentials
        ) || 0;

    const strongPasswords =
        Number(
            report.strongPasswords
        ) || 0;

    const mediumPasswords =
        Number(
            report.mediumPasswords
        ) || 0;

    const weakPasswords =
        Number(
            report.weakPasswords
        ) || 0;


    // =========================================================
    // HEALTH STATUS
    // =========================================================

    let healthStatus =
        "Needs attention";

    if (healthPercentage >= 80) {

        healthStatus =
            "Excellent";

    } else if (healthPercentage >= 60) {

        healthStatus =
            "Good";

    } else if (healthPercentage >= 40) {

        healthStatus =
            "Fair";
    }


    return (

        <div className="password-health-card">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="password-health-header">

                <div>

                    <span className="eyebrow">
                        SECURITY
                    </span>

                    <h3>
                        Password Health
                    </h3>

                    <p>
                        Security overview of your
                        stored passwords.
                    </p>

                </div>


                <div className="health-score">

                    <strong>
                        {healthPercentage}%
                    </strong>

                    <span>
                        {healthStatus}
                    </span>

                </div>

            </div>


            {/* =================================================
                HEALTH BAR
            ================================================= */}

            <div className="health-bar-container">

                <div
                    className="health-bar"
                    style={{
                        width:
                            `${healthPercentage}%`,
                    }}
                />

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="password-health-stats">


                <div className="health-stat">

                    <span className="health-stat-number">
                        {strongPasswords}
                    </span>

                    <span className="health-stat-label">
                        Strong
                    </span>

                </div>


                <div className="health-stat">

                    <span className="health-stat-number">
                        {mediumPasswords}
                    </span>

                    <span className="health-stat-label">
                        Medium
                    </span>

                </div>


                <div className="health-stat">

                    <span className="health-stat-number">
                        {weakPasswords}
                    </span>

                    <span className="health-stat-label">
                        Weak
                    </span>

                </div>


                <div className="health-stat">

                    <span className="health-stat-number">
                        {totalCredentials}
                    </span>

                    <span className="health-stat-label">
                        Total
                    </span>

                </div>

            </div>


            {/* =================================================
                GUIDANCE
            ================================================= */}

            {weakPasswords > 0 && (

                <div className="password-health-warning">

                    <strong>
                        {weakPasswords} password
                        {weakPasswords !== 1
                            ? "s"
                            : ""} need
                        {weakPasswords === 1
                            ? "s"
                            : ""} attention.
                    </strong>

                    <span>
                        Consider updating weak
                        credentials with stronger
                        passwords.
                    </span>

                </div>

            )}
            {/* =================================================
    REPORT EXPORT
================================================= */}

            <div className="page-actions">

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

            {totalCredentials > 0 &&
                weakPasswords === 0 && (

                    <div className="password-health-good">

                        All stored passwords currently
                        meet your strength criteria.

                    </div>

                )}

        </div>
    );
}


export default PasswordHealth;