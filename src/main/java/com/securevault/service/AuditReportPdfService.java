package com.securevault.service;

import com.securevault.entity.AuditLog;
import com.securevault.repository.AuditLogRepository;

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
import java.util.List;

@Service
public class AuditReportPdfService {

    private final AuditLogRepository auditLogRepository;

    public AuditReportPdfService(
            AuditLogRepository auditLogRepository) {

        this.auditLogRepository = auditLogRepository;
    }

    // =========================================================
    // GENERATE AUDIT REPORT PDF
    // =========================================================

    public byte[] generateAuditReportPdf() {

        List<AuditLog> auditLogs = auditLogRepository
                .findAllByOrderByTimestampDesc();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        Document document = new Document(PageSize.A4.rotate());

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
                    "SecureVault Audit Report",
                    titleFont);

            title.setAlignment(
                    Paragraph.ALIGN_CENTER);

            document.add(title);

            document.add(
                    new Paragraph(" "));

            document.add(
                    new Paragraph(
                            "Complete audit activity recorded in SecureVault."));

            document.add(
                    new Paragraph(" "));

            // =================================================
            // SUMMARY
            // =================================================

            Font sectionFont = new Font(
                    Font.HELVETICA,
                    14,
                    Font.BOLD);

            document.add(
                    new Paragraph(
                            "Audit Summary",
                            sectionFont));

            document.add(
                    new Paragraph(" "));

            document.add(
                    new Paragraph(
                            "Total Audit Entries: "
                                    + auditLogs.size()));

            document.add(
                    new Paragraph(" "));

            // =================================================
            // AUDIT TABLE
            // =================================================

            PdfPTable table = new PdfPTable(5);

            table.setWidthPercentage(100);

            addHeaderCell(
                    table,
                    "Action");

            addHeaderCell(
                    table,
                    "Entity");

            addHeaderCell(
                    table,
                    "Entity ID");

            addHeaderCell(
                    table,
                    "Performed By");

            addHeaderCell(
                    table,
                    "Timestamp");

            for (AuditLog log : auditLogs) {

                table.addCell(
                        safeValue(
                                log.getAction()));

                table.addCell(
                        safeValue(
                                log.getEntityType()));

                table.addCell(
                        log.getEntityId() == null
                                ? "-"
                                : String.valueOf(
                                        log.getEntityId()));

                table.addCell(
                        safeValue(
                                log.getPerformedBy()));

                table.addCell(
                        log.getTimestamp() == null
                                ? "-"
                                : log.getTimestamp()
                                        .toString());
            }

            document.add(table);

            document.close();

            return outputStream.toByteArray();

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Failed to generate audit report PDF.",
                    exception);
        }
    }

    // =========================================================
    // HEADER CELL
    // =========================================================

    private void addHeaderCell(
            PdfPTable table,
            String value) {

        Font font = new Font(
                Font.HELVETICA,
                10,
                Font.BOLD);

        PdfPCell cell = new PdfPCell(
                new Phrase(
                        value));

        cell.setPhrase(
                new Phrase(
                        value,
                        font));

        table.addCell(cell);
    }

    // =========================================================
    // SAFE VALUE
    // =========================================================

    private String safeValue(
            String value) {

        return value == null
                ? "-"
                : value;
    }
}