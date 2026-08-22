package com.securevault.entity;

import com.securevault.enums.SharePermission;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "credential_share", indexes = {
        @Index(name = "idx_shared_with", columnList = "shared_with_user_id"),
        @Index(name = "idx_active", columnList = "active")
})
public class CredentialShare {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Credential being shared
    @ManyToOne
    @JoinColumn(name = "credential_id", nullable = false)
    private Credential credential;

    // Owner of the credential
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    // User receiving access
    @ManyToOne
    @JoinColumn(name = "shared_with_user_id", nullable = false)
    private User sharedWith;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SharePermission permission;

    @Column(nullable = false)
    private LocalDateTime sharedAt;

    // Optional
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean active;

    public CredentialShare() {
    }

    public Long getId() {
        return id;
    }

    public Credential getCredential() {
        return credential;
    }

    public void setCredential(Credential credential) {
        this.credential = credential;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public User getSharedWith() {
        return sharedWith;
    }

    public void setSharedWith(User sharedWith) {
        this.sharedWith = sharedWith;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}