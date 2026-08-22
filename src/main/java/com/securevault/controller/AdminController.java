package com.securevault.controller;

import com.securevault.dto.AdminUserResponse;
import com.securevault.response.ApiResponse;
import com.securevault.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserService userService;

    public AdminController(
            UserService userService) {

        this.userService = userService;
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<AdminUserResponse>>> getAllUsers() {

        List<AdminUserResponse> users = userService.getAllUsers();

        ApiResponse<List<AdminUserResponse>> response = new ApiResponse<>(
                true,
                "Users fetched successfully.",
                users);

        return ResponseEntity.ok(response);
    }
}