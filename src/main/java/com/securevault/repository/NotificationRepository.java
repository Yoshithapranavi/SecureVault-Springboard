package com.securevault.repository;

import com.securevault.entity.Notification;
import com.securevault.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    long countByUserAndStatus(
            User user,
            String status);
}