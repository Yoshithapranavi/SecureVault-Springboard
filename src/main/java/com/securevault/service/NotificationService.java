package com.securevault.service;

import com.securevault.dto.NotificationResponse;
import com.securevault.entity.Notification;
import com.securevault.entity.User;
import com.securevault.repository.NotificationRepository;
import com.securevault.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository) {

        this.notificationRepository = notificationRepository;

        this.userRepository = userRepository;
    }

    @Transactional
    public void createNotification(
            User user,
            String title,
            String message,
            String status) {

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setStatus(status);
        notification.setCreatedAt(
                LocalDateTime.now());

        notificationRepository.save(
                notification);
    }

    public List<NotificationResponse> getUserNotifications(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(notification -> new NotificationResponse(
                        notification.getId(),
                        notification.getTitle(),
                        notification.getMessage(),
                        notification.getStatus(),
                        notification.getCreatedAt()))
                .toList();
    }

    @Transactional
    public void markAsRead(
            Long notificationId,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        Notification notification = notificationRepository.findById(
                notificationId)
                .orElseThrow(() -> new RuntimeException(
                        "Notification not found."));

        if (!notification.getUser()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You cannot modify this notification.");
        }

        notification.setStatus("READ");

        notificationRepository.save(
                notification);
    }

    public long getUnreadCount(
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        return notificationRepository
                .countByUserAndStatus(
                        user,
                        "UNREAD");
    }
}