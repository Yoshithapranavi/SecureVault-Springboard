package com.securevault.dto;

import com.securevault.enums.SharePermission;

public class SharedCredentialResponse {

    private Long shareId;

    private Long credentialId;

    private String title;

    private String username;

    private String websiteUrl;

    private SharePermission permission;

    private String ownerEmail;

    public SharedCredentialResponse() {
    }

    // =========================================================
    // SHARE ID
    // =========================================================

    public Long getShareId() {
        return shareId;
    }

    public void setShareId(Long shareId) {
        this.shareId = shareId;
    }

    // =========================================================
    // CREDENTIAL ID
    // =========================================================

    public Long getCredentialId() {
        return credentialId;
    }

    public void setCredentialId(Long credentialId) {
        this.credentialId = credentialId;
    }

    // =========================================================
    // TITLE
    // =========================================================

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    // =========================================================
    // USERNAME
    // =========================================================

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // =========================================================
    // WEBSITE URL
    // =========================================================

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    // =========================================================
    // PERMISSION
    // =========================================================

    public SharePermission getPermission() {
        return permission;
    }

    public void setPermission(SharePermission permission) {
        this.permission = permission;
    }

    // =========================================================
    // OWNER EMAIL
    // =========================================================

    public String getOwnerEmail() {
        return ownerEmail;
    }

    public void setOwnerEmail(String ownerEmail) {
        this.ownerEmail = ownerEmail;
    }
}