package com.securevault.service;

import com.securevault.dto.LoginActivityReport;
import com.securevault.dto.SecurityReportResponse;
import com.securevault.dto.SecuritySummary;
import com.securevault.entity.SecurityAlert;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class SecurityReportExcelService {

    private final SecurityReportService securityReportService;

    public SecurityReportExcelService(
            SecurityReportService securityReportService) {

        this.securityReportService = securityReportService;
    }

    // =========================================================
    // GENERATE SECURITY REPORT EXCEL
    // =========================================================

    public byte[] generateSecurityReportExcel() {

        SecurityReportResponse report = securityReportService.getSecurityReport();

        try (
                Workbook workbook = new XSSFWorkbook();

                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            // =================================================
            // SECURITY SUMMARY SHEET
            // =================================================

            Sheet summarySheet = workbook.createSheet(
                    "Security Summary");

            createSummarySheet(
                    workbook,
                    summarySheet,
                    report.getSummary());

            // =================================================
            // LOGIN ACTIVITY SHEET
            // =================================================

            Sheet loginSheet = workbook.createSheet(
                    "Login Activity");

            createLoginActivitySheet(
                    workbook,
                    loginSheet,
                    report);

            // =================================================
            // SECURITY ALERTS SHEET
            // =================================================

            Sheet alertsSheet = workbook.createSheet(
                    "Security Alerts");

            createSecurityAlertsSheet(
                    workbook,
                    alertsSheet,
                    report);

            // =================================================
            // WRITE WORKBOOK
            // =================================================

            workbook.write(outputStream);

            return outputStream.toByteArray();

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Failed to generate security report Excel file.",
                    exception);
        }
    }

    // =========================================================
    // SUMMARY SHEET
    // =========================================================

    private void createSummarySheet(
            Workbook workbook,
            Sheet sheet,
            SecuritySummary summary) {

        CellStyle headerStyle = createHeaderStyle(workbook);

        Row header = sheet.createRow(0);

        createCell(
                header,
                0,
                "Metric",
                headerStyle);

        createCell(
                header,
                1,
                "Value",
                headerStyle);

        int rowIndex = 1;

        addSummaryRow(
                sheet,
                rowIndex++,
                "Total Security Events",
                summary.getTotalSecurityEvents());

        addSummaryRow(
                sheet,
                rowIndex++,
                "Successful Logins",
                summary.getSuccessfulLogins());

        addSummaryRow(
                sheet,
                rowIndex++,
                "Failed Logins",
                summary.getFailedLogins());

        addSummaryRow(
                sheet,
                rowIndex++,
                "High Risk Events",
                summary.getHighRiskEvents());

        addSummaryRow(
                sheet,
                rowIndex++,
                "Medium Risk Events",
                summary.getMediumRiskEvents());

        addSummaryRow(
                sheet,
                rowIndex++,
                "Low Risk Events",
                summary.getLowRiskEvents());

        addSummaryRow(
                sheet,
                rowIndex,
                "Unresolved Alerts",
                summary.getUnresolvedAlerts());

        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
    }

    // =========================================================
    // LOGIN ACTIVITY SHEET
    // =========================================================

    private void createLoginActivitySheet(
            Workbook workbook,
            Sheet sheet,
            SecurityReportResponse report) {

        CellStyle headerStyle = createHeaderStyle(workbook);

        Row header = sheet.createRow(0);

        String[] columns = {
                "Email",
                "Event Type",
                "IP Address",
                "Risk Level",
                "Status",
                "Timestamp",
                "Description"
        };

        for (int i = 0; i < columns.length; i++) {

            createCell(
                    header,
                    i,
                    columns[i],
                    headerStyle);
        }

        int rowIndex = 1;

        for (LoginActivityReport activity : report.getLoginActivity()) {

            Row row = sheet.createRow(rowIndex++);

            createCell(
                    row,
                    0,
                    activity.getEmail(),
                    null);

            createCell(
                    row,
                    1,
                    activity.getEventType(),
                    null);

            createCell(
                    row,
                    2,
                    activity.getIpAddress(),
                    null);

            createCell(
                    row,
                    3,
                    activity.getRiskLevel(),
                    null);

            createCell(
                    row,
                    4,
                    activity.isSuccessful()
                            ? "SUCCESS"
                            : "FAILED",
                    null);

            createCell(
                    row,
                    5,
                    String.valueOf(
                            activity.getTimestamp()),
                    null);

            createCell(
                    row,
                    6,
                    activity.getDescription(),
                    null);
        }

        autoSizeColumns(
                sheet,
                columns.length);
    }

    // =========================================================
    // SECURITY ALERTS SHEET
    // =========================================================

    private void createSecurityAlertsSheet(
            Workbook workbook,
            Sheet sheet,
            SecurityReportResponse report) {

        CellStyle headerStyle = createHeaderStyle(workbook);

        Row header = sheet.createRow(0);

        String[] columns = {
                "Email",
                "Alert Type",
                "Risk Level",
                "Message",
                "Timestamp",
                "Resolved"
        };

        for (int i = 0; i < columns.length; i++) {

            createCell(
                    header,
                    i,
                    columns[i],
                    headerStyle);
        }

        int rowIndex = 1;

        for (SecurityAlert alert : report.getAlerts()) {

            Row row = sheet.createRow(rowIndex++);

            createCell(
                    row,
                    0,
                    alert.getEmail(),
                    null);

            createCell(
                    row,
                    1,
                    alert.getAlertType(),
                    null);

            createCell(
                    row,
                    2,
                    alert.getRiskLevel().name(),
                    null);

            createCell(
                    row,
                    3,
                    alert.getMessage(),
                    null);

            createCell(
                    row,
                    4,
                    String.valueOf(
                            alert.getTimestamp()),
                    null);

            createCell(
                    row,
                    5,
                    alert.isResolved()
                            ? "YES"
                            : "NO",
                    null);
        }

        autoSizeColumns(
                sheet,
                columns.length);
    }

    // =========================================================
    // HEADER STYLE
    // =========================================================

    private CellStyle createHeaderStyle(
            Workbook workbook) {

        CellStyle style = workbook.createCellStyle();

        Font font = workbook.createFont();

        font.setBold(true);

        style.setFont(font);

        return style;
    }

    // =========================================================
    // SUMMARY ROW
    // =========================================================

    private void addSummaryRow(
            Sheet sheet,
            int rowIndex,
            String metric,
            long value) {

        Row row = sheet.createRow(rowIndex);

        createCell(
                row,
                0,
                metric,
                null);

        createCell(
                row,
                1,
                String.valueOf(value),
                null);
    }

    // =========================================================
    // CELL CREATION
    // =========================================================

    private void createCell(
            Row row,
            int columnIndex,
            String value,
            CellStyle style) {

        Cell cell = row.createCell(columnIndex);

        cell.setCellValue(
                value == null
                        ? ""
                        : value);

        if (style != null) {

            cell.setCellStyle(style);
        }
    }

    // =========================================================
    // AUTO SIZE
    // =========================================================

    private void autoSizeColumns(
            Sheet sheet,
            int columnCount) {

        for (int i = 0; i < columnCount; i++) {

            sheet.autoSizeColumn(i);
        }
    }
}