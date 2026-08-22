package com.securevault.controller;

import com.securevault.dto.PasswordStrengthRequest;
import com.securevault.dto.PasswordStrengthResponse;
import com.securevault.response.ApiResponse;
import com.securevault.service.PasswordService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.securevault.dto.PasswordGeneratorRequest;
import com.securevault.dto.PasswordGeneratorResponse;

@RestController
@RequestMapping("/api/password")
public class PasswordController {
    public PasswordController(PasswordService passwordService) {
        this.passwordService = passwordService;
    }

    private final PasswordService passwordService;

    @PostMapping("/strength")
    public ResponseEntity<ApiResponse<PasswordStrengthResponse>> checkPasswordStrength(

            @Valid @RequestBody PasswordStrengthRequest request) {

        PasswordStrengthResponse result = passwordService.checkPasswordStrength(request);

        ApiResponse<PasswordStrengthResponse> response = new ApiResponse<>(
                true,
                "Password analyzed successfully.",
                result);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<PasswordGeneratorResponse>> generatePassword(

            @Valid @RequestBody PasswordGeneratorRequest request) {

        PasswordGeneratorResponse result = passwordService.generatePassword(request);

        ApiResponse<PasswordGeneratorResponse> response = new ApiResponse<>(
                true,
                "Password generated successfully.",
                result);

        return ResponseEntity.ok(response);
    }
}