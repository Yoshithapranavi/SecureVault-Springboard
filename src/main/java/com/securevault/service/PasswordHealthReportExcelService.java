package com.securevault.service;

import com.securevault.dto.PasswordHealthReport;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
public class PasswordHealthReportExcelService {

    private final CredentialService credentialService;

    public PasswordHealthReportExcelService(
            CredentialService credentialService) {

        this.credentialService = credentialService;
    }

    // =========================================================
    // GENERATE PASSWORD HEALTH EXCEL
    // =========================================================

    public byte[] generatePasswordHealthExcel(
            String authenticatedEmail) {

        PasswordHealthReport report = credentialService.getPasswordHealthReport(
                authenticatedEmail);

        try (
                Workbook workbook = new XSSFWorkbook();

                ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet(
                    "Password Health");

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

            addRow(
                    sheet,
                    1,
                    "Total Credentials",
                    String.valueOf(
                            report.getTotalCredentials()));

            addRow(
                    sheet,
                    2,
                    "Strong Passwords",
                    String.valueOf(
                            report.getStrongPasswords()));

            addRow(
                    sheet,
                    3,
                    "Medium Passwords",
                    String.valueOf(
                            report.getMediumPasswords()));

            addRow(
                    sheet,
                    4,
                    "Weak Passwords",
                    String.valueOf(
                            report.getWeakPasswords()));

            addRow(
                    sheet,
                    5,
                    "Health Percentage",
                    report.getHealthPercentage()
                            + "%");

            addRow(
                    sheet,
                    7,
                    "User",
                    authenticatedEmail);

            addRow(
                    sheet,
                    8,
                    "Recommendation",
                    report.getWeakPasswords() > 0
                            ? "Update weak credentials with stronger passwords."
                            : "All stored passwords currently meet the configured strength criteria.");

            sheet.autoSizeColumn(0);
            sheet.autoSizeColumn(1);

            workbook.write(outputStream);

            return outputStream.toByteArray();

        } catch (Exception exception) {

            throw new RuntimeException(
                    "Failed to generate password health Excel file.",
                    exception);
        }
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
    // ADD ROW
    // =========================================================

    private void addRow(
            Sheet sheet,
            int rowIndex,
            String metric,
            String value) {

        Row row = sheet.createRow(rowIndex);

        createCell(
                row,
                0,
                metric,
                null);

        createCell(
                row,
                1,
                value,
                null);
    }

    // =========================================================
    // CREATE CELL
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
}