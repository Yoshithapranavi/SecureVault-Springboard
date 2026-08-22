package com.securevault.controller;

import com.securevault.dto.LoginActivityReport;
import com.securevault.dto.SecurityReportResponse;
import com.securevault.dto.SecuritySummary;
import com.securevault.entity.SecurityAlert;
import com.securevault.dto.DashboardResponse;
import com.securevault.service.SecurityReportService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.Authentication;
import com.securevault.service.SecurityReportPdfService;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import com.securevault.service.SecurityReportExcelService;

@RestController
@RequestMapping("/api/security/reports")
public class SecurityReportController {

        private final SecurityReportService securityReportService;
        private final SecurityReportPdfService securityReportPdfService;
        private final SecurityReportExcelService securityReportExcelService;

        public SecurityReportController(
                        SecurityReportService securityReportService,
                        SecurityReportPdfService securityReportPdfService,
                        SecurityReportExcelService securityReportExcelService) {

                this.securityReportService = securityReportService;

                this.securityReportPdfService = securityReportPdfService;

                this.securityReportExcelService = securityReportExcelService;
        }

        // =========================================================
        // LOGIN ACTIVITY
        // ADMIN ONLY
        // =========================================================

        @GetMapping("/login-activity/{email}")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<List<LoginActivityReport>> getLoginActivity(
                        @PathVariable String email) {

                return ResponseEntity.ok(
                                securityReportService.getLoginActivity(email));
        }

        // =========================================================
        // SECURITY SUMMARY
        // ADMIN ONLY
        // =========================================================

        @GetMapping("/security-summary")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<SecuritySummary> getSecuritySummary() {

                return ResponseEntity.ok(
                                securityReportService.getSecuritySummary());
        }

        // =========================================================
        // DASHBOARD
        // =========================================================

        @GetMapping("/dashboard")
        public ResponseEntity<DashboardResponse> getDashboard(
                        Authentication authentication) {

                String authenticatedEmail = authentication.getName();

                return ResponseEntity.ok(
                                securityReportService.getDashboard(
                                                authenticatedEmail));
        }
        // =========================================================
        // SECURITY ALERTS
        // ADMIN ONLY
        // =========================================================

        @GetMapping("/alerts")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<List<SecurityAlert>> getAllSecurityAlerts() {

                return ResponseEntity.ok(
                                securityReportService
                                                .getAllSecurityAlerts());
        }

        // =========================================================
        // UNRESOLVED ALERTS
        // ADMIN ONLY
        // =========================================================

        @GetMapping("/alerts/unresolved")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<List<SecurityAlert>> getUnresolvedSecurityAlerts() {

                return ResponseEntity.ok(
                                securityReportService
                                                .getUnresolvedSecurityAlerts());
        }

        // =========================================================
        // RESOLVE ALERT
        // ADMIN ONLY
        // =========================================================

        @PutMapping("/alerts/{alertId}/resolve")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<String> resolveSecurityAlert(
                        @PathVariable Long alertId) {

                String message = securityReportService
                                .resolveSecurityAlert(alertId);

                return ResponseEntity.ok(message);
        }

        // =========================================================
        // COMPLETE SECURITY REPORT
        // ADMIN ONLY
        // =========================================================

        @GetMapping("/security-report")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<SecurityReportResponse> getSecurityReport() {

                return ResponseEntity.ok(
                                securityReportService
                                                .getSecurityReport());
        }
        // =========================================================
        // SECURITY REPORT PDF
        // ADMIN ONLY
        // =========================================================

        @GetMapping("/security-report/pdf")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<byte[]> downloadSecurityReportPdf() {

                byte[] pdf = securityReportPdfService
                                .generateSecurityReportPdf();

                return ResponseEntity.ok()
                                .header(
                                                HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=securevault-security-report.pdf")
                                .contentType(
                                                MediaType.APPLICATION_PDF)
                                .body(pdf);
        }

        // =========================================================
        // SECURITY REPORT EXCEL
        // ADMIN ONLY
        // =========================================================

        @GetMapping("/security-report/excel")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<byte[]> downloadSecurityReportExcel() {

                byte[] excel = securityReportExcelService
                                .generateSecurityReportExcel();

                return ResponseEntity.ok()
                                .header(
                                                HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=securevault-security-report.xlsx")
                                .contentType(
                                                MediaType.parseMediaType(
                                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(excel);
        }
}