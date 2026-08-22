package com.securevault.service;

import com.securevault.dto.PasswordHealthReport;
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
public class PasswordHealthReportPdfService {

    private final CredentialService credentialService;

    public PasswordHealthReportPdfService(
            CredentialService credentialService) {

        this.credentialService = credentialService;
    }

    // =========================================================
    // GENERATE PASSWORD HEALTH PDF
    // =========================================================

    public byte[] generatePasswordHealthPdf(
            String authenticatedEmail) {

        PasswordHealthReport report = credentialService.getPasswordHealthReport(
                authenticatedEmail);

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
                    "SecureVault Password Health Report",
                    titleFont);

            title.setAlignment(
                    Paragraph.ALIGN_CENTER);

            document.add(title);

            document.add(
                    new Paragraph(" "));

            // =================================================
            // REPORT DESCRIPTION
            // =================================================

            document.add(
                    new Paragraph(
                            "Password health summary for: "
                                    + authenticatedEmail));

            document.add(
                    new Paragraph(" "));

            // =================================================
            // HEALTH SUMMARY
            // =================================================

            Font sectionFont = new Font(
                    Font.HELVETICA,
                    14,
                    Font.BOLD);

            document.add(
                    new Paragraph(
                            "Password Health Summary",
                            sectionFont));

            document.add(
                    new Paragraph(" "));

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
                    "Total Credentials");

            addCell(
                    table,
                    String.valueOf(
                            report.getTotalCredentials()));

            addCell(
                    table,
                    "Strong Passwords");

            addCell(
                    table,
                    String.valueOf(
                            report.getStrongPasswords()));

            addCell(
                    table,
                    "Medium Passwords");

            addCell(
                    table,
                    String.valueOf(
                            report.getMediumPasswords()));

            addCell(
                    table,
                    "Weak Passwords");

            addCell(
                    table,
                    String.valueOf(
                            report.getWeakPasswords()));

            addCell(
                    table,
                    "Health Percentage");

            addCell(
                    table,
                    report.getHealthPercentage()
                            + "%");

            document.add(table);

            document.add(
                    new Paragraph(" "));

            // =================================================
            // RECOMMENDATION
            // =================================================

            document.add(
                    new Paragraph(
                            "Recommendation",
                            sectionFont));

            document.add(
                    new Paragraph(" "));

            if (report.getWeakPasswords() > 0) {

                document.add(
                        new Paragraph(
                                "Some stored credentials have weak "
                                        + "passwords. Consider updating "
                                        + "them with stronger passwords."));

            } else {

                document.add(
                        new Paragraph(
                                "All stored passwords currently meet "
                                        + "the configured strength criteria."));
            }

            document.close();

            return outputStream.toByteArray();

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Failed to generate password health PDF.",
                    exception);
        }
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