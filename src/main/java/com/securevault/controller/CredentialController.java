package com.securevault.controller;

import com.securevault.dto.CredentialRequest;
import com.securevault.dto.CredentialResponse;
import com.securevault.dto.PaginatedCredentialResponse;
import com.securevault.dto.PasswordHealthReport;
import com.securevault.enums.Category;
import com.securevault.response.ApiResponse;
import com.securevault.service.CredentialService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.securevault.service.PasswordHealthReportPdfService;
import com.securevault.service.PasswordHealthReportExcelService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;

@RestController
@RequestMapping("/api/vault")
public class CredentialController {

        private final CredentialService credentialService;
        private final PasswordHealthReportPdfService passwordHealthReportPdfService;
        private final PasswordHealthReportExcelService passwordHealthReportExcelService;

        public CredentialController(
                        CredentialService credentialService,
                        PasswordHealthReportPdfService passwordHealthReportPdfService,
                        PasswordHealthReportExcelService passwordHealthReportExcelService) {

                this.credentialService = credentialService;
                this.passwordHealthReportPdfService = passwordHealthReportPdfService;
                this.passwordHealthReportExcelService = passwordHealthReportExcelService;
        }

        // =========================================================
        // SAVE CREDENTIAL
        // =========================================================

        @PostMapping
        public ResponseEntity<ApiResponse<String>> saveCredential(
                        @Valid @RequestBody CredentialRequest request,
                        Authentication authentication) {

                String message = credentialService.saveCredential(
                                request,
                                authentication.getName());

                ApiResponse<String> response = new ApiResponse<>(
                                true,
                                message,
                                null);

                return ResponseEntity.ok(response);
        }
        // =========================================================
        // UPDATE CREDENTIAL
        // =========================================================

        @PutMapping("/{credentialId}")
        public ResponseEntity<ApiResponse<String>> updateCredential(
                        @PathVariable Long credentialId,
                        @Valid @RequestBody CredentialRequest request,
                        Authentication authentication) {

                // Get the authenticated user's identity
                // from the JWT instead of trusting userId
                // sent by the frontend.
                String authenticatedEmail = authentication.getName();

                String message = credentialService.updateCredential(
                                credentialId,
                                request,
                                authenticatedEmail);

                ApiResponse<String> response = new ApiResponse<>(
                                true,
                                message,
                                null);

                return ResponseEntity.ok(response);
        }

        // =========================================================
        // DELETE CREDENTIAL
        // =========================================================

        @DeleteMapping("/{credentialId}")
        public ResponseEntity<ApiResponse<String>> deleteCredential(
                        @PathVariable Long credentialId,
                        Authentication authentication) {

                String message = credentialService.deleteCredential(
                                credentialId,
                                authentication.getName());

                ApiResponse<String> response = new ApiResponse<>(
                                true,
                                message,
                                null);

                return ResponseEntity.ok(response);
        }

        // =========================================================
        // GET SINGLE CREDENTIAL
        // =========================================================

        @GetMapping("/{credentialId}")
        public ResponseEntity<ApiResponse<CredentialResponse>> getCredential(
                        @PathVariable Long credentialId,
                        Authentication authentication) {

                CredentialResponse credential = credentialService.getCredential(
                                credentialId,
                                authentication.getName());

                ApiResponse<CredentialResponse> response = new ApiResponse<>(
                                true,
                                "Credential retrieved successfully.",
                                credential);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/all")
        public ResponseEntity<PaginatedCredentialResponse> getAllCredentials(

                        Authentication authentication,

                        @RequestParam(defaultValue = "0") int page,

                        @RequestParam(defaultValue = "10") int size,

                        @RequestParam(defaultValue = "title") String sortBy,

                        @RequestParam(defaultValue = "asc") String direction,

                        @RequestParam(required = false) Category category,

                        @RequestParam(required = false) String title,

                        @RequestParam(required = false) String username,

                        @RequestParam(required = false) String website) {

                return ResponseEntity.ok(
                                credentialService.getAllCredentials(
                                                authentication.getName(),
                                                page,
                                                size,
                                                sortBy,
                                                direction,
                                                category,
                                                title,
                                                username,
                                                website));
        }

        // =========================================================
        // SEARCH CREDENTIALS
        // =========================================================

        @GetMapping("/search")
        public ResponseEntity<ApiResponse<List<CredentialResponse>>> searchCredentials(

                        Authentication authentication,

                        @RequestParam String keyword) {

                String authenticatedEmail = authentication.getName();

                List<CredentialResponse> credentials = credentialService.searchCredentials(
                                authenticatedEmail,
                                keyword);

                ApiResponse<List<CredentialResponse>> response = new ApiResponse<>(
                                true,
                                "Search completed successfully.",
                                credentials);

                return ResponseEntity.ok(response);
        }

        // =========================================================
        // GET CREDENTIALS BY CATEGORY
        // =========================================================

        @GetMapping
        public ResponseEntity<ApiResponse<List<CredentialResponse>>> getCredentialsByCategory(

                        Authentication authentication,

                        @RequestParam Category category) {

                String authenticatedEmail = authentication.getName();

                List<CredentialResponse> credentials = credentialService.getCredentialsByCategory(
                                authenticatedEmail,
                                category);

                ApiResponse<List<CredentialResponse>> response = new ApiResponse<>(
                                true,
                                "Credentials fetched successfully.",
                                credentials);

                return ResponseEntity.ok(response);
        }

        // =========================================================
        // GET DELETED CREDENTIALS
        // =========================================================

        @GetMapping("/trash")
        public ResponseEntity<ApiResponse<List<CredentialResponse>>> getDeletedCredentials(
                        Authentication authentication) {

                String authenticatedEmail = authentication.getName();

                List<CredentialResponse> credentials = credentialService.getDeletedCredentials(
                                authenticatedEmail);

                ApiResponse<List<CredentialResponse>> response = new ApiResponse<>(
                                true,
                                "Deleted credentials retrieved successfully.",
                                credentials);

                return ResponseEntity.ok(response);
        }

        // =========================================================
        // RESTORE CREDENTIAL
        // =========================================================

        @PutMapping("/restore/{credentialId}")
        public ResponseEntity<ApiResponse<String>> restoreCredential(
                        @PathVariable Long credentialId,
                        Authentication authentication) {

                String message = credentialService.restoreCredential(
                                credentialId,
                                authentication.getName());

                ApiResponse<String> response = new ApiResponse<>(
                                true,
                                message,
                                null);

                return ResponseEntity.ok(response);
        }

        // =========================================================
        // PERMANENT DELETE
        // =========================================================

        @DeleteMapping("/permanent/{credentialId}")
        public ResponseEntity<ApiResponse<String>> permanentlyDeleteCredential(
                        @PathVariable Long credentialId,
                        Authentication authentication) {

                String message = credentialService.permanentlyDeleteCredential(
                                credentialId,
                                authentication.getName());

                ApiResponse<String> response = new ApiResponse<>(
                                true,
                                message,
                                null);

                return ResponseEntity.ok(response);
        }

        // =========================================================
        // PASSWORD HEALTH
        // =========================================================

        @GetMapping("/password-health")
        public ResponseEntity<ApiResponse<PasswordHealthReport>> getPasswordHealthReport(
                        Authentication authentication) {

                PasswordHealthReport report = credentialService.getPasswordHealthReport(
                                authentication.getName());

                ApiResponse<PasswordHealthReport> response = new ApiResponse<>(
                                true,
                                "Password health report generated successfully.",
                                report);

                return ResponseEntity.ok(response);
        }

        // =========================================================
        // TOGGLE FAVORITE
        // =========================================================

        @PatchMapping("/{credentialId}/favorite")
        public ResponseEntity<ApiResponse<Boolean>> toggleFavorite(
                        @PathVariable Long credentialId,
                        Authentication authentication) {

                boolean favorite = credentialService.toggleFavorite(
                                credentialId,
                                authentication.getName());

                ApiResponse<Boolean> response = new ApiResponse<>(
                                true,
                                favorite
                                                ? "Credential added to favorites."
                                                : "Credential removed from favorites.",
                                favorite);

                return ResponseEntity.ok(response);
        }
        // =========================================================
        // PASSWORD HEALTH REPORT PDF
        // AUTHENTICATED USER ONLY
        // =========================================================

        @GetMapping("/password-health/pdf")
        public ResponseEntity<byte[]> downloadPasswordHealthPdf(
                        Authentication authentication) {

                String authenticatedEmail = authentication.getName();

                byte[] pdf = passwordHealthReportPdfService
                                .generatePasswordHealthPdf(
                                                authenticatedEmail);

                return ResponseEntity.ok()
                                .header(
                                                HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=password-health-report.pdf")
                                .contentType(
                                                MediaType.APPLICATION_PDF)
                                .body(pdf);
        }
        // =========================================================
        // PASSWORD HEALTH REPORT EXCEL
        // AUTHENTICATED USER ONLY
        // =========================================================

        @GetMapping("/password-health/excel")
        public ResponseEntity<byte[]> downloadPasswordHealthExcel(
                        Authentication authentication) {

                String authenticatedEmail = authentication.getName();

                byte[] excel = passwordHealthReportExcelService
                                .generatePasswordHealthExcel(
                                                authenticatedEmail);

                return ResponseEntity.ok()
                                .header(
                                                HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=password-health-report.xlsx")
                                .contentType(
                                                MediaType.parseMediaType(
                                                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                                .body(excel);
        }

        // =========================================================
        // ROTATE ENCRYPTION KEY
        // =========================================================

        @PutMapping("/{credentialId}/rotate-key")
        public ResponseEntity<String> rotateEncryptionKey(
                        @PathVariable Long credentialId,
                        Authentication authentication) {

                String authenticatedEmail = authentication.getName();

                String message = credentialService.rotateEncryptionKey(
                                credentialId,
                                authenticatedEmail);

                return ResponseEntity.ok(message);
        }

}