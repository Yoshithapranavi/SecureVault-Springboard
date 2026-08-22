package com.securevault.controller;

import com.securevault.dto.ForgotPasswordRequest;
import com.securevault.dto.ResetPasswordRequest;
import com.securevault.response.ApiResponse;
import com.securevault.service.PasswordRecoveryService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/password")
public class PasswordRecoveryController {

    private final PasswordRecoveryService passwordRecoveryService;

    public PasswordRecoveryController(
            PasswordRecoveryService passwordRecoveryService) {

        this.passwordRecoveryService = passwordRecoveryService;
    }

    @PostMapping("/forgot")
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        passwordRecoveryService.requestPasswordReset(
                request.getEmail());

        /*
         * Deliberately generic response.
         */
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "If the account exists, a password reset link has been sent.",
                null);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        passwordRecoveryService.resetPassword(
                request.getToken(),
                request.getPassword());

        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Password reset successfully.",
                null);

        return ResponseEntity.ok(response);
    }
}