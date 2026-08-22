package com.securevault.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.securevault.enums.Category;

import java.util.List;

@Entity
@Table(name = "credentials", indexes = {
        @Index(name = "idx_user_deleted", columnList = "user_id, deleted"),
        @Index(name = "idx_title", columnList = "title"),
        @Index(name = "idx_username", columnList = "username"),
        @Index(name = "idx_website", columnList = "website_url")
})
public class Credential {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Enumerated(EnumType.STRING)
    private Category category;

    private String username;

    @Column(nullable = false)
    private String encryptedPassword;

    private String websiteUrl;

    @Column(length = 1000)
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "credential", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PasswordHistory> passwordHistory;

    private LocalDateTime createdAt;
    @Column(nullable = false)
    private boolean deleted = false;

    @Column(nullable = false)
    private boolean favorite = false;

    private LocalDateTime deletedAt;

    private LocalDateTime updatedAt;
    @Column(nullable = false)
    private int encryptionKeyVersion = 1;

    public Credential() {
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEncryptedPassword() {
        return encryptedPassword;
    }

    public void setEncryptedPassword(String encryptedPassword) {
        this.encryptedPassword = encryptedPassword;
    }

    public String getWebsiteUrl() {
        return websiteUrl;
    }

    public void setWebsiteUrl(String websiteUrl) {
        this.websiteUrl = websiteUrl;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<PasswordHistory> getPasswordHistory() {
        return passwordHistory;
    }

    public void setPasswordHistory(List<PasswordHistory> passwordHistory) {
        this.passwordHistory = passwordHistory;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public LocalDateTime getDeletedAt() {
        return deletedAt;
    }

    public void setDeletedAt(LocalDateTime deletedAt) {
        this.deletedAt = deletedAt;
    }

    public boolean isFavorite() {
        return favorite;
    }

    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    public int getEncryptionKeyVersion() {
        return encryptionKeyVersion;
    }

    public void setEncryptionKeyVersion(int encryptionKeyVersion) {
        this.encryptionKeyVersion = encryptionKeyVersion;
    }
}