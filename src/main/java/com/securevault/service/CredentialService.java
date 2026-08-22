package com.securevault.service;

import com.securevault.dto.CredentialRequest;
import com.securevault.dto.CredentialResponse;
import com.securevault.dto.PaginatedCredentialResponse;
import com.securevault.dto.PasswordHealthReport;

import com.securevault.entity.AuditLog;
import com.securevault.entity.Credential;
import com.securevault.entity.CredentialShare;
import com.securevault.entity.PasswordHistory;
import com.securevault.entity.User;

import com.securevault.enums.Category;
import com.securevault.enums.SharePermission;

import com.securevault.exception.CredentialNotFoundException;
import com.securevault.exception.PasswordReuseException;
import com.securevault.exception.UserNotFoundException;

import com.securevault.repository.AuditLogRepository;
import com.securevault.repository.CredentialRepository;
import com.securevault.repository.CredentialShareRepository;
import com.securevault.repository.PasswordHistoryRepository;
import com.securevault.repository.UserRepository;

import com.securevault.specification.CredentialSpecification;
import com.securevault.util.AESUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.cache.annotation.CacheEvict;

import org.springframework.cache.annotation.Caching;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.springframework.data.jpa.domain.Specification;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CredentialService {

        private static final Logger logger = LoggerFactory.getLogger(CredentialService.class);

        private final CredentialRepository credentialRepository;
        private final UserRepository userRepository;
        private final AuditLogRepository auditLogRepository;
        private final PasswordHistoryRepository passwordHistoryRepository;
        private final AsyncService asyncService;
        private final CredentialShareRepository credentialShareRepository;

        public CredentialService(
                        CredentialRepository credentialRepository,
                        UserRepository userRepository,
                        AuditLogRepository auditLogRepository,
                        PasswordHistoryRepository passwordHistoryRepository,
                        AsyncService asyncService,
                        CredentialShareRepository credentialShareRepository) {

                this.credentialRepository = credentialRepository;
                this.userRepository = userRepository;
                this.auditLogRepository = auditLogRepository;
                this.passwordHistoryRepository = passwordHistoryRepository;
                this.asyncService = asyncService;
                this.credentialShareRepository = credentialShareRepository;
        }

        // =========================================================
        // SAVE CREDENTIAL
        // =========================================================

        @Transactional
        public String saveCredential(
                        CredentialRequest request,
                        String authenticatedEmail) {

                logger.info(
                                "Creating credential. RequestedBy={}, Title={}",
                                authenticatedEmail,
                                request.getTitle());

                // =========================================================
                // GET AUTHENTICATED USER
                // =========================================================

                User authenticatedUser = userRepository.findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));

                // =========================================================
                // CREATE CREDENTIAL
                // =========================================================

                Credential credential = new Credential();

                credential.setTitle(
                                request.getTitle());

                credential.setCategory(
                                request.getCategory());

                credential.setUsername(
                                request.getUsername());

                credential.setEncryptedPassword(
                                AESUtil.encrypt(
                                                request.getPassword()));

                credential.setWebsiteUrl(
                                request.getWebsiteUrl());

                credential.setNotes(
                                request.getNotes());

                // IMPORTANT:
                // Always associate the credential with the
                // authenticated user, never request.getUserId().
                credential.setUser(
                                authenticatedUser);

                credential.setCreatedAt(
                                LocalDateTime.now());

                credential.setUpdatedAt(
                                LocalDateTime.now());

                credential.setFavorite(false);

                credentialRepository.save(
                                credential);

                logger.info(
                                "Credential created successfully. CredentialId={}, UserId={}",
                                credential.getId(),
                                authenticatedUser.getId());

                // =========================================================
                // NOTIFICATION
                // =========================================================

                asyncService.sendEmailNotification(
                                authenticatedUser.getEmail(),
                                "Credential saved successfully.");

                asyncService.logActivity(
                                "Credential Created : "
                                                + credential.getTitle());

                // =========================================================
                // AUDIT LOG
                // =========================================================

                AuditLog auditLog = new AuditLog();

                auditLog.setAction(
                                "CREDENTIAL_CREATE");

                auditLog.setEntityType(
                                "Credential");

                auditLog.setEntityId(
                                credential.getId());

                auditLog.setPerformedBy(
                                authenticatedUser.getEmail());

                auditLog.setTimestamp(
                                LocalDateTime.now());

                auditLogRepository.save(
                                auditLog);

                return "Credential saved successfully.";
        }

        // =========================================================
        // UPDATE CREDENTIAL
        // =========================================================

        @Transactional
        @Caching(evict = {
                        @CacheEvict(value = "credentialDetails", key = "#credentialId"),
                        @CacheEvict(value = "credentialCategories", allEntries = true)
        })
        public String updateCredential(
                        Long credentialId,
                        CredentialRequest request,
                        String authenticatedEmail) {

                logger.info(
                                "Updating credential. CredentialId={}, RequestedBy={}",
                                credentialId,
                                authenticatedEmail);

                // =========================================================
                // GET AUTHENTICATED USER FROM JWT IDENTITY
                // =========================================================

                User authenticatedUser = userRepository.findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));

                // =========================================================
                // FIND CREDENTIAL
                // =========================================================

                Credential credential = credentialRepository.findById(credentialId)
                                .orElseThrow(() -> new CredentialNotFoundException(
                                                "Credential not found."));

                if (credential.isDeleted()) {

                        throw new CredentialNotFoundException(
                                        "Credential not found.");
                }

                // =========================================================
                // OWNER / SHARED USER ACCESS
                // =========================================================

                boolean isOwner = credential.getUser()
                                .getId()
                                .equals(authenticatedUser.getId());

                if (!isOwner) {

                        // The authenticated user is NOT the owner.
                        // Check whether the credential was shared with them.

                        Optional<CredentialShare> optionalShare = credentialShareRepository
                                        .findActiveShare(
                                                        credential,
                                                        authenticatedUser);

                        if (optionalShare.isEmpty()) {

                                throw new CredentialNotFoundException(
                                                "Access denied.");
                        }

                        CredentialShare share = optionalShare.get();

                        // Only EDIT permission allows modification.

                        // EDIT and FULL_MANAGEMENT permissions allow modification.

                        if (share.getPermission() != SharePermission.EDIT
                                        && share.getPermission() != SharePermission.FULL_MANAGEMENT) {

                                throw new CredentialNotFoundException(
                                                "You do not have permission to modify this credential.");
                        }
                }

                // =========================================================
                // UPDATE BASIC DETAILS
                // =========================================================

                credential.setTitle(
                                request.getTitle());

                credential.setCategory(
                                request.getCategory());

                credential.setUsername(
                                request.getUsername());

                credential.setWebsiteUrl(
                                request.getWebsiteUrl());

                credential.setNotes(
                                request.getNotes());

                // =========================================================
                // PASSWORD UPDATE
                // =========================================================

                if (request.getPassword() != null
                                && !request.getPassword().isBlank()) {

                        String currentPassword = AESUtil.decrypt(
                                        credential.getEncryptedPassword(),
                                        credential.getEncryptionKeyVersion());

                        if (!currentPassword.equals(
                                        request.getPassword())) {

                                List<PasswordHistory> lastFivePasswords = passwordHistoryRepository
                                                .findTop5ByCredentialIdOrderByVersionDesc(
                                                                credential.getId());

                                for (PasswordHistory history : lastFivePasswords) {

                                        String oldPassword = AESUtil.decrypt(
                                                        history.getEncryptedPassword(),
                                                        history.getEncryptionKeyVersion());

                                        if (oldPassword.equals(
                                                        request.getPassword())) {

                                                throw new PasswordReuseException(
                                                                "Password reuse is not allowed. "
                                                                                + "Please choose a new password.");
                                        }
                                }

                                PasswordHistory latestHistory = passwordHistoryRepository
                                                .findTopByCredentialIdOrderByVersionDesc(
                                                                credential.getId());

                                int nextVersion = latestHistory == null
                                                ? 1
                                                : latestHistory.getVersion() + 1;

                                PasswordHistory passwordHistory = new PasswordHistory();

                                passwordHistory.setCredential(
                                                credential);

                                passwordHistory.setEncryptedPassword(
                                                credential.getEncryptedPassword());

                                passwordHistory.setVersion(
                                                nextVersion);

                                passwordHistory.setEncryptionKeyVersion(
                                                credential.getEncryptionKeyVersion());

                                passwordHistory.setCreatedAt(
                                                LocalDateTime.now());

                                passwordHistoryRepository.save(
                                                passwordHistory);

                                credential.setEncryptedPassword(
                                                credential.getEncryptionKeyVersion() == 2
                                                                ? AESUtil.encryptV2(request.getPassword())
                                                                : AESUtil.encrypt(request.getPassword()));
                        }
                }

                // =========================================================
                // SAVE UPDATE
                // =========================================================

                credential.setUpdatedAt(
                                LocalDateTime.now());

                credentialRepository.save(
                                credential);

                // =========================================================
                // NOTIFICATION
                // =========================================================

                asyncService.sendEmailNotification(
                                credential.getUser().getEmail(),
                                "Credential updated successfully.");

                asyncService.logActivity(
                                "Credential Updated : "
                                                + credential.getTitle());

                // =========================================================
                // AUDIT LOG
                // =========================================================

                AuditLog auditLog = new AuditLog();

                auditLog.setAction(
                                "CREDENTIAL_UPDATE");

                auditLog.setEntityType(
                                "Credential");

                auditLog.setEntityId(
                                credential.getId());

                // IMPORTANT:
                // Log the actual authenticated user,
                // not necessarily the credential owner.

                auditLog.setPerformedBy(
                                authenticatedUser.getEmail());

                auditLog.setTimestamp(
                                LocalDateTime.now());

                auditLogRepository.save(
                                auditLog);

                return "Credential updated successfully.";
        }

        // =========================================================
        // DELETE CREDENTIAL - SOFT DELETE
        // =========================================================

        @Transactional
        @Caching(evict = {
                        @CacheEvict(value = "credentialDetails", key = "#credentialId"),
                        @CacheEvict(value = "credentialCategories", allEntries = true)
        })
        public String deleteCredential(
                        Long credentialId,
                        String email) {

                User loggedInUser = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "User not found."));

                Credential credential = credentialRepository.findById(
                                credentialId)
                                .orElseThrow(() -> new CredentialNotFoundException(
                                                "Credential not found."));

                if (credential.isDeleted()) {

                        throw new CredentialNotFoundException(
                                        "Credential not found.");
                }

                if (!credential.getUser().getId()
                                .equals(loggedInUser.getId())) {

                        throw new CredentialNotFoundException(
                                        "Only the owner can delete this credential.");
                }

                credential.setDeleted(true);
                credential.setDeletedAt(
                                LocalDateTime.now());

                credentialRepository.save(
                                credential);

                asyncService.sendEmailNotification(
                                credential.getUser().getEmail(),
                                "Credential moved to trash.");

                asyncService.logActivity(
                                "Credential Soft Deleted : "
                                                + credential.getTitle());

                AuditLog auditLog = new AuditLog();

                auditLog.setAction(
                                "CREDENTIAL_DELETE");

                auditLog.setEntityType(
                                "Credential");

                auditLog.setEntityId(
                                credential.getId());

                auditLog.setPerformedBy(
                                credential.getUser().getEmail());

                auditLog.setTimestamp(
                                LocalDateTime.now());

                auditLogRepository.save(
                                auditLog);

                return "Credential moved to trash successfully.";
        }

        // =========================================================
        // GET SINGLE CREDENTIAL
        // =========================================================

        public CredentialResponse getCredential(
                        Long credentialId,
                        String authenticatedEmail) {

                User authenticatedUser = userRepository.findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));

                Credential credential = credentialRepository.findById(credentialId)
                                .orElseThrow(() -> new CredentialNotFoundException(
                                                "Credential not found."));

                if (credential.isDeleted()) {

                        throw new CredentialNotFoundException(
                                        "Credential not found.");
                }

                // =====================================================
                // OWNER ACCESS
                // =====================================================

                boolean isOwner = credential.getUser()
                                .getId()
                                .equals(authenticatedUser.getId());

                // =====================================================
                // SHARED ACCESS
                // =====================================================

                if (!isOwner) {

                        CredentialShare share = credentialShareRepository
                                        .findActiveShare(
                                                        credential,
                                                        authenticatedUser)
                                        .orElseThrow(() -> new CredentialNotFoundException(
                                                        "Access denied."));
                }

                // =====================================================
                // RESPONSE
                // =====================================================

                CredentialResponse response = new CredentialResponse();

                response.setId(
                                credential.getId());

                response.setTitle(
                                credential.getTitle());

                response.setCategory(
                                credential.getCategory());

                response.setUsername(
                                credential.getUsername());

                response.setPassword(
                                AESUtil.decrypt(
                                                credential.getEncryptedPassword(),
                                                credential.getEncryptionKeyVersion()));

                response.setWebsiteUrl(
                                credential.getWebsiteUrl());

                response.setNotes(
                                credential.getNotes());

                response.setFavorite(
                                credential.isFavorite());

                return response;
        }

        // =========================================================
        // GET ALL CREDENTIALS
        // =========================================================

        public PaginatedCredentialResponse getAllCredentials(
                        String authenticatedEmail,
                        int page,
                        int size,
                        String sortBy,
                        String direction,
                        Category category,
                        String title,
                        String username,
                        String website) {

                User authenticatedUser = userRepository
                                .findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));

                Long userId = authenticatedUser.getId();

                Sort sort = direction.equalsIgnoreCase("asc")
                                ? Sort.by(sortBy).ascending()
                                : Sort.by(sortBy).descending();

                Pageable pageable = PageRequest.of(
                                page,
                                size,
                                sort);

                Specification<Credential> specification = CredentialSpecification.filterCredentials(
                                userId,
                                category,
                                title,
                                username,
                                website);

                Page<Credential> credentialPage = credentialRepository.findAll(
                                specification,
                                pageable);

                List<CredentialResponse> responseList = new ArrayList<>();

                for (Credential credential : credentialPage.getContent()) {

                        CredentialResponse response = new CredentialResponse();

                        response.setId(
                                        credential.getId());

                        response.setTitle(
                                        credential.getTitle());

                        response.setCategory(
                                        credential.getCategory());

                        response.setUsername(
                                        credential.getUsername());

                        response.setPassword(
                                        AESUtil.decrypt(
                                                        credential.getEncryptedPassword(),
                                                        credential.getEncryptionKeyVersion()));

                        response.setWebsiteUrl(
                                        credential.getWebsiteUrl());

                        response.setNotes(
                                        credential.getNotes());

                        response.setFavorite(
                                        credential.isFavorite());

                        responseList.add(response);
                }

                PaginatedCredentialResponse response = new PaginatedCredentialResponse();

                response.setContent(
                                responseList);

                response.setCurrentPage(
                                credentialPage.getNumber());

                response.setPageSize(
                                credentialPage.getSize());

                response.setTotalElements(
                                credentialPage.getTotalElements());

                response.setTotalPages(
                                credentialPage.getTotalPages());

                return response;
        }

        // =========================================================
        // SEARCH CREDENTIALS
        // =========================================================

        public List<CredentialResponse> searchCredentials(
                        String authenticatedEmail,
                        String keyword) {

                User authenticatedUser = userRepository.findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));

                Long userId = authenticatedUser.getId();

                List<Credential> credentials = credentialRepository
                                .findByUserIdAndDeletedFalse(userId);

                String searchKeyword = keyword == null
                                ? ""
                                : keyword.toLowerCase().trim();

                return credentials.stream()
                                .filter(credential -> credential.getTitle()
                                                .toLowerCase()
                                                .contains(searchKeyword)
                                                ||
                                                credential.getUsername()
                                                                .toLowerCase()
                                                                .contains(searchKeyword)
                                                ||
                                                (credential.getWebsiteUrl() != null
                                                                &&
                                                                credential.getWebsiteUrl()
                                                                                .toLowerCase()
                                                                                .contains(searchKeyword)))
                                .map(credential -> {

                                        CredentialResponse response = new CredentialResponse();

                                        response.setId(
                                                        credential.getId());

                                        response.setTitle(
                                                        credential.getTitle());

                                        response.setCategory(
                                                        credential.getCategory());

                                        response.setUsername(
                                                        credential.getUsername());

                                        response.setPassword(
                                                        AESUtil.decrypt(
                                                                        credential.getEncryptedPassword(),
                                                                        credential.getEncryptionKeyVersion()));

                                        response.setWebsiteUrl(
                                                        credential.getWebsiteUrl());

                                        response.setNotes(
                                                        credential.getNotes());

                                        response.setFavorite(
                                                        credential.isFavorite());

                                        return response;
                                })
                                .toList();
        }

        // =========================================================
        // GET CREDENTIALS BY CATEGORY
        // =========================================================

        public List<CredentialResponse> getCredentialsByCategory(
                        String authenticatedEmail,
                        Category category) {

                User authenticatedUser = userRepository.findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));

                Long userId = authenticatedUser.getId();

                List<Credential> credentials = credentialRepository
                                .findByUserIdAndCategoryAndDeletedFalse(
                                                userId,
                                                category);

                List<CredentialResponse> responseList = new ArrayList<>();

                for (Credential credential : credentials) {

                        CredentialResponse response = new CredentialResponse();

                        response.setId(
                                        credential.getId());

                        response.setTitle(
                                        credential.getTitle());

                        response.setCategory(
                                        credential.getCategory());

                        response.setUsername(
                                        credential.getUsername());

                        response.setPassword(
                                        AESUtil.decrypt(
                                                        credential.getEncryptedPassword(),
                                                        credential.getEncryptionKeyVersion()));

                        response.setWebsiteUrl(
                                        credential.getWebsiteUrl());

                        response.setNotes(
                                        credential.getNotes());

                        response.setFavorite(
                                        credential.isFavorite());

                        responseList.add(response);
                }

                return responseList;
        }

        // =========================================================
        // GET DELETED CREDENTIALS
        // =========================================================

        public List<CredentialResponse> getDeletedCredentials(
                        String authenticatedEmail) {

                User authenticatedUser = userRepository.findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));

                Long userId = authenticatedUser.getId();

                List<Credential> credentials = credentialRepository
                                .findByUserIdAndDeletedTrue(userId);

                List<CredentialResponse> responseList = new ArrayList<>();

                for (Credential credential : credentials) {

                        CredentialResponse response = new CredentialResponse();

                        response.setId(
                                        credential.getId());

                        response.setTitle(
                                        credential.getTitle());

                        response.setCategory(
                                        credential.getCategory());

                        response.setUsername(
                                        credential.getUsername());

                        response.setPassword(
                                        AESUtil.decrypt(
                                                        credential.getEncryptedPassword(),
                                                        credential.getEncryptionKeyVersion()));

                        response.setWebsiteUrl(
                                        credential.getWebsiteUrl());

                        response.setNotes(
                                        credential.getNotes());

                        response.setFavorite(
                                        credential.isFavorite());

                        responseList.add(response);
                }

                return responseList;
        }
        // =========================================================
        // RESTORE CREDENTIAL
        // =========================================================

        @Transactional
        @Caching(evict = {
                        @CacheEvict(value = "credentialDetails", key = "#credentialId"),
                        @CacheEvict(value = "credentialCategories", allEntries = true)
        })
        public String restoreCredential(
                        Long credentialId,
                        String authenticatedEmail) {

                User authenticatedUser = userRepository.findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));

                Optional<Credential> optionalCredential = credentialRepository.findByIdAndDeletedTrue(
                                credentialId);

                if (optionalCredential.isEmpty()) {

                        throw new CredentialNotFoundException(
                                        "Credential not found in trash.");
                }

                Credential credential = optionalCredential.get();

                // =========================================================
                // OWNER CHECK
                // =========================================================

                if (!credential.getUser().getId()
                                .equals(authenticatedUser.getId())) {

                        throw new CredentialNotFoundException(
                                        "Only the owner can restore this credential.");
                }

                // =========================================================
                // RESTORE
                // =========================================================

                credential.setDeleted(false);
                credential.setDeletedAt(null);

                credentialRepository.save(
                                credential);

                // =========================================================
                // NOTIFICATION
                // =========================================================

                asyncService.sendEmailNotification(
                                credential.getUser().getEmail(),
                                "Credential restored successfully.");

                asyncService.logActivity(
                                "Credential Restored : "
                                                + credential.getTitle());

                // =========================================================
                // AUDIT LOG
                // =========================================================

                AuditLog auditLog = new AuditLog();

                auditLog.setAction(
                                "RESTORE");

                auditLog.setEntityType(
                                "Credential");

                auditLog.setEntityId(
                                credential.getId());

                auditLog.setPerformedBy(
                                authenticatedUser.getEmail());

                auditLog.setTimestamp(
                                LocalDateTime.now());

                auditLogRepository.save(
                                auditLog);

                return "Credential restored successfully.";
        }
        // =========================================================
        // PERMANENT DELETE
        // =========================================================

        @Transactional
        @Caching(evict = {
                        @CacheEvict(value = "credentialDetails", key = "#credentialId"),
                        @CacheEvict(value = "credentialCategories", allEntries = true)
        })
        public String permanentlyDeleteCredential(
                        Long credentialId,
                        String authenticatedEmail) {

                // =========================================================
                // GET AUTHENTICATED USER
                // =========================================================

                User authenticatedUser = userRepository.findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));

                // =========================================================
                // FIND DELETED CREDENTIAL
                // =========================================================

                Credential credential = credentialRepository
                                .findByIdAndDeletedTrue(credentialId)
                                .orElseThrow(() -> new CredentialNotFoundException(
                                                "Credential not found in trash."));

                // =========================================================
                // OWNER CHECK
                // =========================================================

                if (!credential.getUser().getId()
                                .equals(authenticatedUser.getId())) {

                        throw new CredentialNotFoundException(
                                        "Only the owner can permanently delete this credential.");
                }

                // =========================================================
                // SAVE INFORMATION BEFORE DELETE
                // =========================================================

                String email = credential.getUser().getEmail();

                String title = credential.getTitle();

                Long deletedCredentialId = credential.getId();

                // =========================================================
                // DELETE DEPENDENT RECORDS FIRST
                // =========================================================

                passwordHistoryRepository
                                .deleteByCredentialId(
                                                credentialId);

                credentialShareRepository
                                .deleteByCredentialId(
                                                credentialId);

                // =========================================================
                // DELETE CREDENTIAL
                // =========================================================

                credentialRepository.delete(
                                credential);

                credentialRepository.flush();

                // =========================================================
                // NOTIFICATION
                // =========================================================

                asyncService.sendEmailNotification(
                                email,
                                "Credential permanently deleted.");

                asyncService.logActivity(
                                "Credential Permanently Deleted : "
                                                + title);

                // =========================================================
                // AUDIT LOG
                // =========================================================

                AuditLog auditLog = new AuditLog();

                auditLog.setAction(
                                "PERMANENT_DELETE");

                auditLog.setEntityType(
                                "Credential");

                auditLog.setEntityId(
                                deletedCredentialId);

                auditLog.setPerformedBy(
                                authenticatedUser.getEmail());

                auditLog.setTimestamp(
                                LocalDateTime.now());

                auditLogRepository.save(
                                auditLog);

                return "Credential permanently deleted.";
        }
        // =========================================================
        // ROTATE ENCRYPTION KEY
        // =========================================================

        @Transactional
        public String rotateEncryptionKey(
                        Long credentialId,
                        String authenticatedEmail) {

                // =====================================================
                // GET AUTHENTICATED USER
                // =====================================================

                User authenticatedUser = userRepository
                                .findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));

                // =====================================================
                // FIND CREDENTIAL
                // =====================================================

                Credential credential = credentialRepository
                                .findById(credentialId)
                                .orElseThrow(() -> new CredentialNotFoundException(
                                                "Credential not found."));

                if (credential.isDeleted()) {

                        throw new CredentialNotFoundException(
                                        "Credential not found.");
                }

                // =====================================================
                // OWNER CHECK
                // =====================================================

                if (!credential.getUser()
                                .getId()
                                .equals(authenticatedUser.getId())) {

                        throw new CredentialNotFoundException(
                                        "Only the owner can rotate the encryption key.");
                }

                // =====================================================
                // CHECK CURRENT KEY VERSION
                // =====================================================

                if (credential.getEncryptionKeyVersion() == 2) {

                        return "Credential is already encrypted with key version 2.";
                }

                // =====================================================
                // DECRYPT USING VERSION 1 KEY
                // =====================================================

                String decryptedPassword = AESUtil.decrypt(
                                credential.getEncryptedPassword(),
                                credential.getEncryptionKeyVersion());

                // =====================================================
                // RE-ENCRYPT USING VERSION 2 KEY
                // =====================================================

                String reEncryptedPassword = AESUtil.encryptV2(
                                decryptedPassword);

                credential.setEncryptedPassword(
                                reEncryptedPassword);

                credential.setEncryptionKeyVersion(2);

                credential.setUpdatedAt(
                                LocalDateTime.now());

                credentialRepository.save(
                                credential);

                // =====================================================
                // AUDIT LOG
                // =====================================================

                AuditLog auditLog = new AuditLog();

                auditLog.setAction(
                                "CREDENTIAL_KEY_ROTATION");

                auditLog.setEntityType(
                                "Credential");

                auditLog.setEntityId(
                                credential.getId());

                auditLog.setPerformedBy(
                                authenticatedUser.getEmail());

                auditLog.setTimestamp(
                                LocalDateTime.now());

                auditLogRepository.save(
                                auditLog);

                logger.info(
                                "Encryption key rotated. CredentialId={}, UserId={}, Version=2",
                                credential.getId(),
                                authenticatedUser.getId());

                return "Credential encryption key rotated successfully.";
        }

        // =========================================================
        // PASSWORD HEALTH REPORT
        // =========================================================

        public PasswordHealthReport getPasswordHealthReport(
                        String authenticatedEmail) {

                User authenticatedUser = userRepository.findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));

                Long userId = authenticatedUser.getId();

                List<Credential> credentials = credentialRepository
                                .findByUserIdAndDeletedFalse(userId);

                long strongPasswords = 0;
                long mediumPasswords = 0;
                long weakPasswords = 0;

                for (Credential credential : credentials) {

                        String decryptedPassword = AESUtil.decrypt(
                                        credential.getEncryptedPassword(),
                                        credential.getEncryptionKeyVersion());

                        int score = 0;

                        if (decryptedPassword.length() >= 12) {
                                score++;
                        }

                        if (decryptedPassword.matches(
                                        ".*[A-Z].*")) {
                                score++;
                        }

                        if (decryptedPassword.matches(
                                        ".*[a-z].*")) {
                                score++;
                        }

                        if (decryptedPassword.matches(
                                        ".*\\d.*")) {
                                score++;
                        }

                        if (decryptedPassword.matches(
                                        ".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>/?].*")) {
                                score++;
                        }

                        if (score <= 2) {

                                weakPasswords++;

                        } else if (score <= 4) {

                                mediumPasswords++;

                        } else {

                                strongPasswords++;
                        }
                }

                long totalCredentials = credentials.size();

                double healthPercentage = totalCredentials == 0
                                ? 100.0
                                : ((strongPasswords * 100.0)
                                                / totalCredentials);

                return new PasswordHealthReport(
                                totalCredentials,
                                strongPasswords,
                                mediumPasswords,
                                weakPasswords,
                                Math.round(
                                                healthPercentage * 100.0)
                                                / 100.0);
        }

        // =========================================================
        // TOGGLE FAVORITE
        // =========================================================

        @Transactional
        @Caching(evict = {
                        @CacheEvict(value = "credentialDetails", key = "#credentialId"),
                        @CacheEvict(value = "credentialCategories", allEntries = true)
        })
        public boolean toggleFavorite(
                        Long credentialId,
                        String email) {

                User loggedInUser = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "User not found."));

                Credential credential = credentialRepository.findById(
                                credentialId)
                                .orElseThrow(() -> new CredentialNotFoundException(
                                                "Credential not found."));

                // Cannot favorite deleted credentials
                if (credential.isDeleted()) {

                        throw new CredentialNotFoundException(
                                        "Credential not found.");
                }

                // Only the owner can change favorite status
                if (!credential.getUser().getId()
                                .equals(loggedInUser.getId())) {

                        throw new CredentialNotFoundException(
                                        "Only the owner can modify favorite status.");
                }

                boolean newFavoriteStatus = !credential.isFavorite();

                credential.setFavorite(
                                newFavoriteStatus);

                credential.setUpdatedAt(
                                LocalDateTime.now());

                credentialRepository.save(
                                credential);

                logger.info(
                                "Favorite status changed. CredentialId={}, UserId={}, Favorite={}",
                                credentialId,
                                loggedInUser.getId(),
                                newFavoriteStatus);

                asyncService.logActivity(
                                (newFavoriteStatus
                                                ? "Credential Added to Favorites : "
                                                : "Credential Removed from Favorites : ")
                                                + credential.getTitle());

                AuditLog auditLog = new AuditLog();

                auditLog.setAction(
                                newFavoriteStatus
                                                ? "CREDENTIAL_FAVORITE"
                                                : "CREDENTIAL_UNFAVORITE");

                auditLog.setEntityType(
                                "Credential");

                auditLog.setEntityId(
                                credential.getId());

                auditLog.setPerformedBy(
                                loggedInUser.getEmail());

                auditLog.setTimestamp(
                                LocalDateTime.now());

                auditLogRepository.save(
                                auditLog);

                return newFavoriteStatus;
        }
}
