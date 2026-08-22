package com.securevault.controller;

import com.securevault.dto.LoginResponse;
import com.securevault.dto.MfaVerifyRequest;
import com.securevault.response.ApiResponse;
import com.securevault.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/mfa")
public class MfaController {

        private final UserService userService;

        public MfaController(
                        UserService userService) {

                this.userService = userService;
        }

        @PostMapping("/verify")
        public ResponseEntity<ApiResponse<LoginResponse>> verifyMfa(
                        @Valid @RequestBody MfaVerifyRequest request,
                        HttpServletRequest httpRequest) {

                LoginResponse loginResponse = userService.verifyMfa(
                                request.getEmail(),
                                request.getOtp(),
                                httpRequest);

                ApiResponse<LoginResponse> response = new ApiResponse<>(
                                true,
                                "MFA verification successful.",
                                loginResponse);

                return ResponseEntity.ok(response);
        }
}