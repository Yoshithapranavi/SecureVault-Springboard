package com.securevault.dto;

import com.securevault.enums.SharePermission;

import java.time.LocalDateTime;

public class ShareManagementResponse {

    private Long shareId;

    private Long credentialId;

    private Long sharedWithUserId;

    private String sharedWithName;

    private String sharedWithEmail;

    private SharePermission permission;

    private LocalDateTime sharedAt;

    private LocalDateTime expiresAt;

    public ShareManagementResponse() {
    }

    public Long getShareId() {
        return shareId;
    }

    public void setShareId(Long shareId) {
        this.shareId = shareId;
    }

    public Long getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(Long credentialId) {
        this.credentialId = credentialId;
    }

    public Long getSharedWithUserId() {
        return sharedWithUserId;
    }

    public void setSharedWithUserId(Long sharedWithUserId) {
        this.sharedWithUserId = sharedWithUserId;
    }

    public String getSharedWithName() {
        return sharedWithName;
    }

    public void setSharedWithName(String sharedWithName) {
        this.sharedWithName = sharedWithName;
    }

    public String getSharedWithEmail() {
        return sharedWithEmail;
    }

    public void setSharedWithEmail(String sharedWithEmail) {
        this.sharedWithEmail = sharedWithEmail;
    }

    public SharePermission getPermission() {
        return permission;
    }

    public void setPermission(SharePermission permission) {
        this.permission = permission;
    }

    public LocalDateTime getSharedAt() {
        return sharedAt;
    }

    public void setSharedAt(LocalDateTime sharedAt) {
        this.sharedAt = sharedAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}