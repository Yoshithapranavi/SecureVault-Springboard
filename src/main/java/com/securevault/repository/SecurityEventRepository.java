package com.securevault.repository;

import com.securevault.entity.SecurityEvent;
import com.securevault.enums.SecurityEventType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

import java.util.List;

import com.securevault.enums.RiskLevel;

@Repository
public interface SecurityEventRepository extends JpaRepository<SecurityEvent, Long> {

        long countByEmailAndEventTypeAndSuccessfulFalseAndTimestampAfter(
                        String email,
                        SecurityEventType eventType,
                        LocalDateTime timestamp);

        boolean existsByEmailAndEventTypeAndUserAgentAndSuccessfulTrue(
                        String email,
                        SecurityEventType eventType,
                        String userAgent);

        long countBySuccessfulTrue();

        long countBySuccessfulFalse();

        long countByRiskLevel(RiskLevel riskLevel);

        long countByEmailAndEventTypeAndSuccessfulTrue(
                        String email,
                        SecurityEventType eventType);

        long countByEmailAndSuccessfulFalse(String email);

        List<SecurityEvent> findTop5ByEmailOrderByTimestampDesc(
                        String email);

        List<SecurityEvent> findByEmailOrderByTimestampDesc(String email);
}