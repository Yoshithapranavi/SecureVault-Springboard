package com.securevault.service;

import com.securevault.entity.AuditLog;
import com.securevault.repository.AuditLogRepository;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class AuditReportExcelService {

    private final AuditLogRepository auditLogRepository;

    public AuditReportExcelService(
            AuditLogRepository auditLogRepository) {

        this.auditLogRepository = auditLogRepository;
    }

    // =========================================================
    // GENERATE AUDIT REPORT EXCEL
    // =========================================================

    public byte[] generateAuditReportExcel() {

        List<AuditLog> auditLogs = auditLogRepository
                .findAllByOrderByTimestampDesc();

        try (
                Workbook workbook = new XSSFWorkbook();

                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet(
                    "Audit Report");

            // =================================================
            // HEADER STYLE
            // =================================================

            CellStyle headerStyle = workbook.createCellStyle();

            Font headerFont = workbook.createFont();

            headerFont.setBold(true);

            headerStyle.setFont(headerFont);

            // =================================================
            // HEADER
            // =================================================

            Row header = sheet.createRow(0);

            createCell(
                    header,
                    0,
                    "Action",
                    headerStyle);

            createCell(
                    header,
                    1,
                    "Entity",
                    headerStyle);

            createCell(
                    header,
                    2,
                    "Entity ID",
                    headerStyle);

            createCell(
                    header,
                    3,
                    "Performed By",
                    headerStyle);

            createCell(
                    header,
                    4,
                    "Timestamp",
                    headerStyle);

            // =================================================
            // DATA
            // =================================================

            int rowIndex = 1;

            for (AuditLog log : auditLogs) {

                Row row = sheet.createRow(
                        rowIndex++);

                createCell(
                        row,
                        0,
                        safeValue(
                                log.getAction()),
                        null);

                createCell(
                        row,
                        1,
                        safeValue(
                                log.getEntityType()),
                        null);

                createCell(
                        row,
                        2,
                        log.getEntityId() == null
                                ? "-"
                                : String.valueOf(
                                        log.getEntityId()),
                        null);

                createCell(
                        row,
                        3,
                        safeValue(
                                log.getPerformedBy()),
                        null);

                createCell(
                        row,
                        4,
                        log.getTimestamp() == null
                                ? "-"
                                : log.getTimestamp()
                                        .toString(),
                        null);
            }

            // =================================================
            // AUTO SIZE
            // =================================================

            for (int column = 0; column < 5; column++) {

                sheet.autoSizeColumn(
                        column);
            }

            workbook.write(
                    outputStream);

            return outputStream.toByteArray();

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Failed to generate audit report Excel file.",
                    exception);
        }
    }

    // =========================================================
    // CREATE CELL
    // =========================================================

    private void createCell(
            Row row,
            int columnIndex,
            String value,
            CellStyle style) {

        Cell cell = row.createCell(
                columnIndex);

        cell.setCellValue(
                value == null
                        ? ""
                        : value);

        if (style != null) {

            cell.setCellStyle(style);
        }
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