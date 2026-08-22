package com.securevault.repository;

import com.securevault.entity.AuditLog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    List<AuditLog> findAllByOrderByTimestampDesc();

    List<AuditLog> findByPerformedByOrderByTimestampDesc(String performedBy);

    List<AuditLog> findTop5ByOrderByTimestampDesc();

    List<AuditLog> findTop5ByPerformedByOrderByTimestampDesc(
            String performedBy);

}