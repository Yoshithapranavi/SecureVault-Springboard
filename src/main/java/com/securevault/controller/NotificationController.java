package com.securevault.controller;

import com.securevault.dto.NotificationResponse;
import com.securevault.response.ApiResponse;
import com.securevault.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(
            NotificationService notificationService) {

        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationResponse>>> getNotifications(
            Authentication authentication) {

        List<NotificationResponse> notifications = notificationService.getUserNotifications(
                authentication.getName());

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Notifications fetched successfully.",
                        notifications));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(
            Authentication authentication) {

        long count = notificationService.getUnreadCount(
                authentication.getName());

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Unread notification count fetched successfully.",
                        count));
    }

    @PutMapping("/{notificationId}/read")
    public ResponseEntity<ApiResponse<String>> markAsRead(
            @PathVariable Long notificationId,
            Authentication authentication) {

        notificationService.markAsRead(
                notificationId,
                authentication.getName());

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Notification marked as read.",
                        null));
    }
}