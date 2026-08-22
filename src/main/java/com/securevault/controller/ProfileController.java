package com.securevault.controller;

import com.securevault.dto.ChangePasswordRequest;
import com.securevault.dto.ProfileResponse;
import com.securevault.dto.UpdateProfileRequest;
import com.securevault.response.ApiResponse;
import com.securevault.service.ProfileService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(
            ProfileService profileService) {

        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(
            Authentication authentication) {

        ProfileResponse profile = profileService.getProfile(
                authentication.getName());

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Profile fetched successfully.",
                        profile));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        ProfileResponse profile = profileService.updateProfile(
                authentication.getName(),
                request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Profile updated successfully.",
                        profile));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Authentication authentication) {

        profileService.changePassword(
                authentication.getName(),
                request);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Password changed successfully.",
                        null));
    }
}