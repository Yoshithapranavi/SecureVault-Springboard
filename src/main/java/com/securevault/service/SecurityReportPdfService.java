package com.securevault.service;

import com.securevault.dto.LoginActivityReport;
import com.securevault.dto.SecurityReportResponse;
import com.securevault.dto.SecuritySummary;
import com.securevault.entity.SecurityAlert;

import com.lowagie.text.Document;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class SecurityReportPdfService {

    private final SecurityReportService securityReportService;

    public SecurityReportPdfService(
            SecurityReportService securityReportService) {

        this.securityReportService = securityReportService;
    }

    // =========================================================
    // GENERATE SECURITY REPORT PDF
    // =========================================================

    public byte[] generateSecurityReportPdf() {

        SecurityReportResponse report = securityReportService.getSecurityReport();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4);

        try {

            PdfWriter.getInstance(
                    document,
                    outputStream);

            document.open();

            // =================================================
            // TITLE
            // =================================================

            Font titleFont = new Font(
                    Font.HELVETICA,
                    20,
                    Font.BOLD);

            Paragraph title = new Paragraph(
                    "SecureVault Security Report",
                    titleFont);

            title.setAlignment(
                    Paragraph.ALIGN_CENTER);

            document.add(title);

            document.add(
                    new Paragraph(
                            " "));

            // =================================================
            // SECURITY SUMMARY
            // =================================================

            addSectionTitle(
                    document,
                    "Security Summary");

            addSecuritySummary(
                    document,
                    report.getSummary());

            document.add(
                    new Paragraph(
                            " "));

            // =================================================
            // LOGIN ACTIVITY
            // =================================================

            addSectionTitle(
                    document,
                    "Login Activity");

            addLoginActivityTable(
                    document,
                    report);

            document.add(
                    new Paragraph(
                            " "));

            // =================================================
            // SECURITY ALERTS
            // =================================================

            addSectionTitle(
                    document,
                    "Security Alerts");

            addSecurityAlertsTable(
                    document,
                    report);

            document.close();

            return outputStream.toByteArray();

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Failed to generate security report PDF.",
                    exception);
        }
    }

    // =========================================================
    // SECTION TITLE
    // =========================================================

    private void addSectionTitle(
            Document document,
            String title) {

        Font sectionFont = new Font(
                Font.HELVETICA,
                14,
                Font.BOLD);

        document.add(
                new Paragraph(
                        title,
                        sectionFont));
    }

    // =========================================================
    // SECURITY SUMMARY
    // =========================================================

    private void addSecuritySummary(
            Document document,
            SecuritySummary summary) {

        PdfPTable table = new PdfPTable(2);

        table.setWidthPercentage(100);

        addCell(
                table,
                "Metric");

        addCell(
                table,
                "Value");

        addCell(
                table,
                "Total Security Events");

        addCell(
                table,
                String.valueOf(
                        summary.getTotalSecurityEvents()));

        addCell(
                table,
                "Successful Logins");

        addCell(
                table,
                String.valueOf(
                        summary.getSuccessfulLogins()));

        addCell(
                table,
                "Failed Logins");

        addCell(
                table,
                String.valueOf(
                        summary.getFailedLogins()));

        addCell(
                table,
                "High Risk Events");

        addCell(
                table,
                String.valueOf(
                        summary.getHighRiskEvents()));

        addCell(
                table,
                "Medium Risk Events");

        addCell(
                table,
                String.valueOf(
                        summary.getMediumRiskEvents()));

        addCell(
                table,
                "Low Risk Events");

        addCell(
                table,
                String.valueOf(
                        summary.getLowRiskEvents()));

        addCell(
                table,
                "Unresolved Alerts");

        addCell(
                table,
                String.valueOf(
                        summary.getUnresolvedAlerts()));

        document.add(table);
    }

    // =========================================================
    // LOGIN ACTIVITY TABLE
    // =========================================================

    private void addLoginActivityTable(
            Document document,
            SecurityReportResponse report) {

        PdfPTable table = new PdfPTable(6);

        table.setWidthPercentage(100);

        addCell(table, "Email");
        addCell(table, "Event");
        addCell(table, "IP Address");
        addCell(table, "Risk");
        addCell(table, "Status");
        addCell(table, "Timestamp");

        for (LoginActivityReport activity : report.getLoginActivity()) {

            addCell(
                    table,
                    activity.getEmail());

            addCell(
                    table,
                    activity.getEventType());

            addCell(
                    table,
                    activity.getIpAddress());

            addCell(
                    table,
                    activity.getRiskLevel());

            addCell(
                    table,
                    activity.isSuccessful()
                            ? "SUCCESS"
                            : "FAILED");

            addCell(
                    table,
                    String.valueOf(
                            activity.getTimestamp()));
        }

        document.add(table);
    }

    // =========================================================
    // SECURITY ALERTS TABLE
    // =========================================================

    private void addSecurityAlertsTable(
            Document document,
            SecurityReportResponse report) {

        PdfPTable table = new PdfPTable(6);

        table.setWidthPercentage(100);

        addCell(table, "Email");
        addCell(table, "Alert Type");
        addCell(table, "Risk");
        addCell(table, "Message");
        addCell(table, "Timestamp");
        addCell(table, "Resolved");

        for (SecurityAlert alert : report.getAlerts()) {

            addCell(
                    table,
                    alert.getEmail());

            addCell(
                    table,
                    alert.getAlertType());

            addCell(
                    table,
                    alert.getRiskLevel().name());

            addCell(
                    table,
                    alert.getMessage());

            addCell(
                    table,
                    String.valueOf(
                            alert.getTimestamp()));

            addCell(
                    table,
                    alert.isResolved()
                            ? "YES"
                            : "NO");
        }

        document.add(table);
    }

    // =========================================================
    // TABLE CELL
    // =========================================================

    private void addCell(
            PdfPTable table,
            String value) {

        PdfPCell cell = new PdfPCell(
                new Phrase(
                        value == null
                                ? ""
                                : value));

        table.addCell(cell);
    }
}