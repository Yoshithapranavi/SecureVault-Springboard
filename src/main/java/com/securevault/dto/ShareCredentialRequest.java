package com.securevault.dto;

import com.securevault.enums.SharePermission;

import java.time.LocalDateTime;

public class ShareCredentialRequest {

    private Long credentialId;

    // Owner of the credential
    private Long ownerId;

    // User receiving access
    private Long sharedWithUserId;

    // Permission granted to the recipient
    private SharePermission permission;

    // Optional expiration time
    private LocalDateTime expiresAt;

    public ShareCredentialRequest() {
    }

    public Long getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(Long credentialId) {
        this.credentialId = credentialId;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public Long getSharedWithUserId() {
        return sharedWithUserId;
    }

    public void setSharedWithUserId(Long sharedWithUserId) {
        this.sharedWithUserId = sharedWithUserId;
    }

    public SharePermission getPermission() {
        return permission;
    }

    public void setPermission(SharePermission permission) {
        this.permission = permission;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}