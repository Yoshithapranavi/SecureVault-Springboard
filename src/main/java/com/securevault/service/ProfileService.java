package com.securevault.service;

import com.securevault.dto.ChangePasswordRequest;
import com.securevault.dto.ProfileResponse;
import com.securevault.dto.UpdateProfileRequest;
import com.securevault.entity.User;
import com.securevault.repository.UserRepository;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public ProfileService(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            NotificationService notificationService) {

        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;

        this.notificationService = notificationService;
    }

    public ProfileResponse getProfile(
            String email) {

        User user = getUser(email);

        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole());
    }

    @Transactional
    public ProfileResponse updateProfile(
            String email,
            UpdateProfileRequest request) {

        User user = getUser(email);

        user.setName(
                request.getName());

        user.setUpdatedAt(
                LocalDateTime.now());

        userRepository.save(user);

        notificationService.createNotification(
                user,
                "Profile Updated",
                "Your SecureVault profile was updated.",
                "UNREAD");

        return new ProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole());
    }

    @Transactional
    public void changePassword(
            String email,
            ChangePasswordRequest request) {

        User user = getUser(email);

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPasswordHash())) {

            throw new IllegalArgumentException(
                    "Current password is incorrect.");
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPasswordHash())) {

            throw new IllegalArgumentException(
                    "New password must be different from the current password.");
        }

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getNewPassword()));

        user.setUpdatedAt(
                LocalDateTime.now());

        userRepository.save(user);

        notificationService.createNotification(
                user,
                "Password Changed",
                "Your SecureVault password was changed successfully.",
                "UNREAD");
    }

    private User getUser(String email) {

        return userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));
    }
}