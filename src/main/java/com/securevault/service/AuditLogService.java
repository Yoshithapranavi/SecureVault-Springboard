package com.securevault.service;

import com.securevault.entity.AuditLog;
import com.securevault.repository.AuditLogRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public List<AuditLog> getAllAuditLogs() {
        return auditLogRepository.findAllByOrderByTimestampDesc();
    }

    public List<AuditLog> getUserAuditLogs(String email) {
        return auditLogRepository.findByPerformedByOrderByTimestampDesc(email);
    }
}