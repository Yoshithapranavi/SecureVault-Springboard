package com.securevault.repository;

import com.securevault.entity.SecurityAlert;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SecurityAlertRepository
        extends JpaRepository<SecurityAlert, Long> {

    // =========================================================
    // COUNT UNRESOLVED ALERTS
    // =========================================================

    long countByResolvedFalse();

    // =========================================================
    // RECENT ALERTS
    // =========================================================

    List<SecurityAlert> findTop5ByOrderByTimestampDesc();

    // =========================================================
    // USER SPECIFIC ALERTS
    // =========================================================

    List<SecurityAlert> findTop5ByUserIdOrderByTimestampDesc(
            Long userId);

    // =========================================================
    // ADMIN - ALL ALERTS
    // =========================================================

    List<SecurityAlert> findAllByOrderByTimestampDesc();

    // =========================================================
    // ADMIN - UNRESOLVED ALERTS
    // =========================================================

    List<SecurityAlert> findByResolvedFalseOrderByTimestampDesc();
}