import { useEffect, useState } from "react";
import {
    getPasswordHealth,
    downloadPasswordHealthPdf,
    downloadPasswordHealthExcel,
} from "../services/vaultService";
import Icon from "./Icon";

function PasswordHealth({ compact = false }) {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [downloadingPdf, setDownloadingPdf] = useState(false);
    const [downloadingExcel, setDownloadingExcel] = useState(false);

    useEffect(() => {
        loadPasswordHealth();
        // Health data is loaded once for the mounted report.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadPasswordHealth = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getPasswordHealth();

            if (response?.success) {
                setReport(response.data);
            } else {
                setError(
                    response?.message || "Unable to load password health.",
                );
            }
        } catch (err) {
            console.error("Password health error:", err);

            setError(
                err.response?.data?.message || "Unable to load password health.",
            );
        } finally {
            setLoading(false);
        }
    };

    const downloadBlob = (blob, type, filename) => {
        const url = window.URL.createObjectURL(new Blob([blob], { type }));
        const link = document.createElement("a");

        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    };

    const handleDownloadPdf = async () => {
        try {
            setDownloadingPdf(true);
            setError("");

            const pdfBlob = await downloadPasswordHealthPdf();

            downloadBlob(pdfBlob, "application/pdf", "password-health-report.pdf");
        } catch (err) {
            console.error("Password health PDF error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to download password health PDF.",
            );
        } finally {
            setDownloadingPdf(false);
        }
    };

    const handleDownloadExcel = async () => {
        try {
            setDownloadingExcel(true);
            setError("");

            const excelBlob = await downloadPasswordHealthExcel();

            downloadBlob(
                excelBlob,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "password-health-report.xlsx",
            );
        } catch (err) {
            console.error("Password health Excel error:", err);

            setError(
                err.response?.data?.message ||
                    "Unable to download password health Excel.",
            );
        } finally {
            setDownloadingExcel(false);
        }
    };

    if (loading) {
        return (
            <div className={compact ? "sv-health-compact-loading" : "sv-loading-panel"}>
                Loading password health…
            </div>
        );
    }

    if (error) {
        return (
            <div className={compact ? "sv-health-compact-error" : "sv-error-panel"}>
                <div className="sv-error-icon" aria-hidden="true">
                    <Icon name="warning" />
                </div>
                <div>
                    <h2>Password health unavailable</h2>
                    <p>{error}</p>
                </div>
                <button
                    type="button"
                    className="sv-btn sv-btn-secondary"
                    onClick={loadPasswordHealth}
                >
                    Try again
                </button>
            </div>
        );
    }

    if (!report) {
        return (
            <div className="sv-empty-state">
                <span className="sv-empty-icon" aria-hidden="true">
                    <Icon name="health" size={22} />
                </span>
                <div>
                    <strong>No password health data yet</strong>
                    <p>Add credentials to generate a strength report.</p>
                </div>
            </div>
        );
    }

    const healthPercentage = Math.max(
        0,
        Math.min(100, Math.round(Number(report.healthPercentage) || 0)),
    );
    const totalCredentials = Number(report.totalCredentials) || 0;
    const strongPasswords = Number(report.strongPasswords) || 0;
    const mediumPasswords = Number(report.mediumPasswords) || 0;
    const weakPasswords = Number(report.weakPasswords) || 0;

    const percentOf = (value) =>
        totalCredentials > 0 ? Math.round((value / totalCredentials) * 100) : 0;

    let healthStatus = "Needs attention";
    let healthTone = "warning";

    if (totalCredentials === 0) {
        healthStatus = "No credentials";
        healthTone = "neutral";
    } else if (healthPercentage >= 80) {
        healthStatus = "Excellent";
        healthTone = "positive";
    } else if (healthPercentage >= 60) {
        healthStatus = "Good";
        healthTone = "neutral";
    } else if (healthPercentage >= 40) {
        healthStatus = "Fair";
        healthTone = "warning";
    }

    if (compact) {
        return (
            <section className="sv-health-compact" aria-label="Password health summary">
                <div className={`sv-health-compact-score ${healthTone}`}>
                    <strong>{totalCredentials === 0 ? "—" : `${healthPercentage}%`}</strong>
                    <span>{healthStatus}</span>
                </div>

                <div className="sv-health-compact-bars">
                    <div className="sv-health-segment strong">
                        <span style={{ width: `${percentOf(strongPasswords)}%` }} />
                    </div>
                    <div className="sv-health-segment medium">
                        <span style={{ width: `${percentOf(mediumPasswords)}%` }} />
                    </div>
                    <div className="sv-health-segment weak">
                        <span style={{ width: `${percentOf(weakPasswords)}%` }} />
                    </div>
                </div>

                <div className="sv-health-compact-copy">
                    <strong>{strongPasswords} strong</strong>
                    <span>{mediumPasswords} medium</span>
                    <span className={weakPasswords > 0 ? "is-warning" : ""}>
                        {weakPasswords} weak
                    </span>
                </div>

                <span className="sv-health-compact-total">
                    {totalCredentials} credential{totalCredentials === 1 ? "" : "s"}
                </span>
            </section>
        );
    }

    return (
        <section className="sv-health-page">
            <header className="sv-page-header">
                <div>
                    <span className="sv-eyebrow">Security</span>
                    <h1>Password Health</h1>
                    <p>
                        Measure the strength of stored passwords and identify
                        credentials that need attention.
                    </p>
                </div>

                <div className="sv-header-actions">
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={handleDownloadPdf}
                        disabled={downloadingPdf}
                    >
                        <Icon name="download" size={16} />
                        {downloadingPdf ? "Downloading…" : "PDF report"}
                    </button>
                    <button
                        type="button"
                        className="sv-btn sv-btn-secondary"
                        onClick={handleDownloadExcel}
                        disabled={downloadingExcel}
                    >
                        <Icon name="download" size={16} />
                        {downloadingExcel ? "Downloading…" : "Excel report"}
                    </button>
                </div>
            </header>

            <div className="sv-health-layout">
                <section className="sv-health-score-card">
                    <div className="sv-panel-heading">
                        <div>
                            <span className="sv-eyebrow">Overall score</span>
                            <h2>Password strength</h2>
                        </div>
                        <span className={`sv-status-chip ${healthTone}`}>
                            {healthStatus}
                        </span>
                    </div>

                    <div
                        className={`sv-score-ring large ${healthTone}`}
                        style={{ "--score": `${healthPercentage * 3.6}deg` }}
                        role="img"
                        aria-label={`Password health score ${healthPercentage} percent`}
                    >
                        <div className="sv-score-inner">
                            <strong>{healthPercentage}%</strong>
                            <span>password health</span>
                        </div>
                    </div>

                    <p className="sv-health-summary">
                        {totalCredentials === 0
                            ? "No credentials are stored yet."
                            : weakPasswords > 0
                              ? `${weakPasswords} of ${totalCredentials} credentials use weak passwords and should be updated.`
                              : "All stored passwords currently meet the configured strength criteria."}
                    </p>
                </section>

                <section className="sv-health-distribution">
                    <div className="sv-panel-heading">
                        <div>
                            <span className="sv-eyebrow">Distribution</span>
                            <h2>Strength breakdown</h2>
                        </div>
                        <span className="sv-toolbar-count">{totalCredentials} total</span>
                    </div>

                    <div className="sv-distribution-list">
                        <div className="sv-distribution-row">
                            <span className="sv-distribution-label">
                                <i className="positive" /> Strong
                            </span>
                            <div className="sv-distribution-track">
                                <span
                                    className="positive"
                                    style={{ width: `${percentOf(strongPasswords)}%` }}
                                />
                            </div>
                            <strong>{strongPasswords}</strong>
                            <small>{percentOf(strongPasswords)}%</small>
                        </div>

                        <div className="sv-distribution-row">
                            <span className="sv-distribution-label">
                                <i className="neutral" /> Medium
                            </span>
                            <div className="sv-distribution-track">
                                <span
                                    className="neutral"
                                    style={{ width: `${percentOf(mediumPasswords)}%` }}
                                />
                            </div>
                            <strong>{mediumPasswords}</strong>
                            <small>{percentOf(mediumPasswords)}%</small>
                        </div>

                        <div className="sv-distribution-row">
                            <span className="sv-distribution-label">
                                <i className="warning" /> Weak
                            </span>
                            <div className="sv-distribution-track">
                                <span
                                    className="warning"
                                    style={{ width: `${percentOf(weakPasswords)}%` }}
                                />
                            </div>
                            <strong>{weakPasswords}</strong>
                            <small>{percentOf(weakPasswords)}%</small>
                        </div>
                    </div>

                    {weakPasswords > 0 ? (
                        <div className="sv-callout warning">
                            <Icon name="warning" size={18} />
                            <div>
                                <strong>
                                    {weakPasswords} password{weakPasswords === 1 ? "" : "s"} need attention
                                </strong>
                                <span>
                                    Replace weak passwords with longer, unique
                                    credentials generated in SecureVault.
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className="sv-callout positive">
                            <Icon name="check" size={18} />
                            <div>
                                <strong>No weak passwords detected</strong>
                                <span>
                                    Continue reviewing credentials after any
                                    account or password change.
                                </span>
                            </div>
                        </div>
                    )}
                </section>
            </div>
        </section>
    );
}

export default PasswordHealth;
