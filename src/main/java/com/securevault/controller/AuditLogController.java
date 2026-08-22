package com.securevault.controller;

import com.securevault.entity.AuditLog;
import com.securevault.service.AuditLogService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.securevault.service.AuditReportPdfService;
import com.securevault.service.AuditReportExcelService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AuditLogController {

    private final AuditLogService auditLogService;
    private final AuditReportPdfService auditReportPdfService;
    private final AuditReportExcelService auditReportExcelService;

    public AuditLogController(
            AuditLogService auditLogService,
            AuditReportPdfService auditReportPdfService,
            AuditReportExcelService auditReportExcelService) {

        this.auditLogService = auditLogService;
        this.auditReportPdfService = auditReportPdfService;
        this.auditReportExcelService = auditReportExcelService;
    }

    // =========================================================
    // GET ALL AUDIT LOGS
    // ADMIN ONLY
    // =========================================================

    @GetMapping
    public ResponseEntity<List<AuditLog>> getAllAuditLogs() {

        return ResponseEntity.ok(
                auditLogService.getAllAuditLogs());
    }

    // =========================================================
    // GET USER AUDIT LOGS
    // ADMIN ONLY
    // =========================================================

    @GetMapping("/user/{email}")
    public ResponseEntity<List<AuditLog>> getUserAuditLogs(
            @PathVariable String email) {

        return ResponseEntity.ok(
                auditLogService.getUserAuditLogs(email));
    }
    // =========================================================
    // AUDIT REPORT PDF
    // ADMIN ONLY
    // =========================================================

    @GetMapping("/report/pdf")
    public ResponseEntity<byte[]> downloadAuditReportPdf() {

        byte[] pdf = auditReportPdfService
                .generateAuditReportPdf();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=audit-report.pdf")
                .contentType(
                        MediaType.APPLICATION_PDF)
                .body(pdf);
    }
    // =========================================================
    // AUDIT REPORT EXCEL
    // ADMIN ONLY
    // =========================================================

    @GetMapping("/report/excel")
    public ResponseEntity<byte[]> downloadAuditReportExcel() {

        byte[] excel = auditReportExcelService
                .generateAuditReportExcel();

        return ResponseEntity.ok()
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=audit-report.xlsx")
                .contentType(
                        MediaType.parseMediaType(
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(excel);
    }
}