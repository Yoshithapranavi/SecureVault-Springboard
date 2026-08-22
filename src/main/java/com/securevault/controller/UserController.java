package com.securevault.controller;

import com.securevault.dto.LoginRequest;
import com.securevault.dto.LoginResponse;
import com.securevault.dto.RegisterRequest;
import com.securevault.response.ApiResponse;
import com.securevault.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import com.securevault.entity.User;
import com.securevault.dto.CurrentUserResponse;

@RestController
@RequestMapping("/api/auth")
public class UserController {

        private final UserService userService;

        public UserController(UserService userService) {
                this.userService = userService;
        }

        @PostMapping("/register")
        public ResponseEntity<ApiResponse<String>> registerUser(
                        @Valid @RequestBody RegisterRequest request) {

                String message = userService.registerUser(request);

                ApiResponse<String> response = new ApiResponse<>(true, message, null);

                return ResponseEntity.ok(response);
        }

        @PostMapping("/login")
        public ResponseEntity<ApiResponse<LoginResponse>> loginUser(
                        @Valid @RequestBody LoginRequest request,
                        HttpServletRequest httpRequest) {

                LoginResponse loginResponse = userService.loginUser(request, httpRequest);

                ApiResponse<LoginResponse> response = new ApiResponse<>(
                                true,
                                "Login successful.",
                                loginResponse);

                return ResponseEntity.ok(response);
        }

        @PostMapping("/logout")
        public ResponseEntity<ApiResponse<String>> logout(
                        Authentication authentication,
                        HttpServletRequest request) {

                String authHeader = request.getHeader("Authorization");

                if (authHeader == null
                                || !authHeader.startsWith("Bearer ")) {

                        throw new IllegalArgumentException(
                                        "Authorization token is required.");
                }

                String token = authHeader.substring(7);

                userService.logout(
                                authentication.getName(),
                                token);

                ApiResponse<String> response = new ApiResponse<>(
                                true,
                                "Logout successful.",
                                null);

                return ResponseEntity.ok(response);
        }

        @GetMapping("/me")
        public ResponseEntity<ApiResponse<CurrentUserResponse>> getCurrentUser(
                        Authentication authentication) {

                User user = userService.getCurrentUser(
                                authentication.getName());

                CurrentUserResponse currentUser = new CurrentUserResponse(
                                user.getId(),
                                user.getName(),
                                user.getEmail(),
                                user.getRole());

                ApiResponse<CurrentUserResponse> response = new ApiResponse<>(
                                true,
                                "Current user retrieved successfully.",
                                currentUser);

                return ResponseEntity.ok(response);
        }
}