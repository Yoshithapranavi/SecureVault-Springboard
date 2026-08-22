package com.securevault.controller;

import com.securevault.dto.ShareCredentialRequest;
import com.securevault.dto.SharedCredentialResponse;
import com.securevault.dto.ShareManagementResponse;
import com.securevault.dto.UpdateSharePermissionRequest;
import com.securevault.response.ApiResponse;
import com.securevault.service.CredentialShareService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/share")
public class CredentialShareController {

        private final CredentialShareService credentialShareService;

        public CredentialShareController(
                        CredentialShareService credentialShareService) {

                this.credentialShareService = credentialShareService;
        }

        // =========================================================
        // SHARE CREDENTIAL
        // =========================================================

        @PostMapping
        public ResponseEntity<String> shareCredential(
                        @RequestBody ShareCredentialRequest request,
                        Authentication authentication) {

                String message = credentialShareService.shareCredential(
                                request,
                                authentication.getName());

                return ResponseEntity.ok(message);
        }

        // =========================================================
        // GET CREDENTIALS SHARED WITH ME
        // =========================================================

        @GetMapping("/shared-with-me/{userId}")
        public ResponseEntity<ApiResponse<List<SharedCredentialResponse>>> getSharedCredentials(
                        @PathVariable Long userId,
                        Authentication authentication) {

                List<SharedCredentialResponse> sharedCredentials = credentialShareService.getSharedCredentials(
                                userId,
                                authentication.getName());

                ApiResponse<List<SharedCredentialResponse>> response = new ApiResponse<>(
                                true,
                                "Shared credentials fetched successfully.",
                                sharedCredentials);

                return ResponseEntity.ok(response);
        }

        // =========================================================
        // GET SHARES FOR MY CREDENTIAL
        // =========================================================

        @GetMapping("/credential/{credentialId}")
        public ResponseEntity<ApiResponse<List<ShareManagementResponse>>> getCredentialShares(
                        @PathVariable Long credentialId,
                        Authentication authentication) {

                List<ShareManagementResponse> shares = credentialShareService.getCredentialShares(
                                credentialId,
                                authentication.getName());

                ApiResponse<List<ShareManagementResponse>> response = new ApiResponse<>(
                                true,
                                "Credential shares fetched successfully.",
                                shares);

                return ResponseEntity.ok(response);
        }

        // =========================================================
        // UPDATE SHARE PERMISSION
        // =========================================================

        @PutMapping("/{shareId}/permission")
        public ResponseEntity<ApiResponse<String>> updatePermission(
                        @PathVariable Long shareId,
                        @RequestBody UpdateSharePermissionRequest request,
                        Authentication authentication) {

                String message = credentialShareService.updatePermission(
                                shareId,
                                request,
                                authentication.getName());

                ApiResponse<String> response = new ApiResponse<>(
                                true,
                                message,
                                null);

                return ResponseEntity.ok(response);
        }
        // =========================================================
        // UPDATE SHARE PERMISSION - FULL MANAGEMENT
        // =========================================================

        @PutMapping("/{shareId}/manager-permission")
        public ResponseEntity<ApiResponse<String>> updatePermissionAsManager(
                        @PathVariable Long shareId,
                        @RequestBody UpdateSharePermissionRequest request,
                        Authentication authentication) {

                String message = credentialShareService.updatePermissionAsManager(
                                shareId,
                                request,
                                authentication.getName());

                ApiResponse<String> response = new ApiResponse<>(
                                true,
                                message,
                                null);

                return ResponseEntity.ok(response);
        }

        // =========================================================
        // REVOKE SHARE
        // =========================================================

        @DeleteMapping("/{shareId}")
        public ResponseEntity<ApiResponse<String>> revokeShare(
                        @PathVariable Long shareId,
                        Authentication authentication) {

                String message = credentialShareService.revokeShare(
                                shareId,
                                authentication.getName());

                ApiResponse<String> response = new ApiResponse<>(
                                true,
                                message,
                                null);

                return ResponseEntity.ok(response);
        }
}