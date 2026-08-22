package com.securevault.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class AsyncService {

    @Async("secureVaultExecutor")
    public void sendEmailNotification(String email, String message) {

        System.out.println("\n========================================");
        System.out.println("EMAIL TASK STARTED");
        System.out.println("Background Thread : " + Thread.currentThread().getName());
        System.out.println("Thread ID         : " + Thread.currentThread().getId());
        System.out.println("Email             : " + email);
        System.out.println("Message           : " + message);
        System.out.println("========================================");

        try {
            // Simulate Email Sending
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        System.out.println("Email Sent Successfully");
        System.out.println("========================================\n");
    }

    @Async("secureVaultExecutor")
    public void logActivity(String activity) {

        System.out.println("\n========================================");
        System.out.println("ACTIVITY LOG TASK STARTED");
        System.out.println("Background Thread : " + Thread.currentThread().getName());
        System.out.println("Thread ID         : " + Thread.currentThread().getId());
        System.out.println("Activity          : " + activity);
        System.out.println("========================================");

        try {
            // Simulate Activity Logging
            Thread.sleep(1500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        System.out.println("Activity Logged Successfully");
        System.out.println("========================================\n");
    }

}