package com.securevault.service;

import com.securevault.dto.ShareCredentialRequest;
import com.securevault.dto.SharedCredentialResponse;
import com.securevault.dto.UpdateSharePermissionRequest;
import com.securevault.dto.ShareManagementResponse;

import com.securevault.entity.Credential;
import com.securevault.entity.CredentialShare;
import com.securevault.entity.User;

import com.securevault.enums.SharePermission;

import com.securevault.exception.CredentialAlreadySharedException;
import com.securevault.exception.CredentialNotFoundException;
import com.securevault.exception.InvalidShareException;
import com.securevault.exception.UserNotFoundException;

import com.securevault.repository.CredentialRepository;
import com.securevault.repository.CredentialShareRepository;
import com.securevault.repository.UserRepository;
import com.securevault.repository.AuditLogRepository;

import com.securevault.entity.AuditLog;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CredentialShareService {

        private final CredentialShareRepository credentialShareRepository;
        private final CredentialRepository credentialRepository;
        private final UserRepository userRepository;
        private final AuditLogRepository auditLogRepository;
        private final NotificationService notificationService;

        public CredentialShareService(
                        CredentialShareRepository credentialShareRepository,
                        CredentialRepository credentialRepository,
                        UserRepository userRepository, NotificationService notificationService,
                        AuditLogRepository auditLogRepository) {

                this.credentialShareRepository = credentialShareRepository;

                this.credentialRepository = credentialRepository;

                this.userRepository = userRepository;

                this.auditLogRepository = auditLogRepository;
                this.notificationService = notificationService;
        }

        // =========================================================
        // SHARE CREDENTIAL
        // =========================================================

        @Transactional
        public String shareCredential(
                        ShareCredentialRequest request,
                        String authenticatedEmail) {

                User owner = userRepository
                                .findByEmail(authenticatedEmail)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));

                User sharedUser = userRepository
                                .findById(request.getSharedWithUserId())
                                .orElseThrow(() -> new InvalidShareException(
                                                "User to share with not found."));

                Credential credential = credentialRepository
                                .findByIdAndUserIdAndDeletedFalse(
                                                request.getCredentialId(),
                                                owner.getId())
                                .orElseThrow(() -> new CredentialNotFoundException(
                                                "Credential not found or access denied."));

                // Cannot share with yourself
                if (owner.getId().equals(sharedUser.getId())) {

                        throw new InvalidShareException(
                                        "You cannot share a credential with yourself.");
                }

                // Permission required
                if (request.getPermission() == null) {

                        throw new InvalidShareException(
                                        "Permission is required.");
                }

                // Prevent duplicate active share
                if (credentialShareRepository
                                .findActiveShare(
                                                credential,
                                                sharedUser)
                                .isPresent()) {

                        throw new CredentialAlreadySharedException(
                                        "Credential is already shared with this user.");
                }

                CredentialShare share = new CredentialShare();

                share.setCredential(credential);
                share.setOwner(owner);
                share.setSharedWith(sharedUser);
                share.setPermission(request.getPermission());
                share.setSharedAt(LocalDateTime.now());

                if (request.getExpiresAt() != null) {

                        if (!request.getExpiresAt()
                                        .isAfter(LocalDateTime.now())) {

                                throw new InvalidShareException(
                                                "Expiration time must be in the future.");
                        }

                        share.setExpiresAt(
                                        request.getExpiresAt());

                } else {

                        share.setExpiresAt(null);
                }

                share.setActive(true);

                credentialShareRepository.save(share);
                notificationService.createNotification(
                                sharedUser,
                                "Credential Shared With You",
                                owner.getName()
                                                + " shared "
                                                + credential.getTitle()
                                                + " with you.",
                                "UNREAD");

                saveAudit(
                                "CREDENTIAL_SHARE",
                                "Credential",
                                credential.getId(),
                                owner.getEmail());

                return "Credential shared successfully.";
        }

        // =========================================================
        // SHARED WITH ME
        // =========================================================

        public List<SharedCredentialResponse> getSharedCredentials(
                        Long userId,
                        String authenticatedEmail) {
                User authenticatedUser = getAuthenticatedUser(authenticatedEmail);

                if (!authenticatedUser.getId().equals(userId)) {

                        throw new InvalidShareException(
                                        "You can only view credentials shared with your own account.");
                }

                userRepository.findById(userId)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "User not found."));

                List<CredentialShare> shares = credentialShareRepository
                                .findActiveSharesWithDetails(userId);

                List<SharedCredentialResponse> responseList = new ArrayList<>();

                for (CredentialShare share : shares) {

                        if (!share.isActive()) {
                                continue;
                        }

                        SharedCredentialResponse response = new SharedCredentialResponse();

                        response.setShareId(share.getId());

                        response.setTitle(
                                        share.getCredential().getTitle());

                        response.setCredentialId(
                                        share.getCredential().getId());

                        response.setUsername(
                                        share.getCredential().getUsername());

                        response.setWebsiteUrl(
                                        share.getCredential().getWebsiteUrl());

                        response.setPermission(
                                        share.getPermission());

                        response.setOwnerEmail(
                                        share.getOwner().getEmail());

                        responseList.add(response);
                }

                return responseList;
        }

        // =========================================================
        // GET SHARES FOR OWNER
        // =========================================================

        public List<ShareManagementResponse> getCredentialShares(
                        Long credentialId,
                        String authenticatedEmail) {

                User owner = getAuthenticatedUser(
                                authenticatedEmail);

                // Make sure credential belongs to this owner
                credentialRepository
                                .findByIdAndUserIdAndDeletedFalse(
                                                credentialId,
                                                owner.getId())
                                .orElseThrow(() -> new CredentialNotFoundException(
                                                "Credential not found or access denied."));

                List<CredentialShare> shares = credentialShareRepository
                                .findActiveSharesForOwner(
                                                credentialId,
                                                owner.getId());

                List<ShareManagementResponse> response = new ArrayList<>();

                for (CredentialShare share : shares) {

                        ShareManagementResponse item = new ShareManagementResponse();

                        User sharedWith = share.getSharedWith();

                        item.setShareId(share.getId());

                        item.setCredentialId(credentialId);

                        item.setSharedWithUserId(
                                        sharedWith.getId());

                        item.setSharedWithName(
                                        sharedWith.getName());

                        item.setSharedWithEmail(
                                        sharedWith.getEmail());

                        item.setPermission(
                                        share.getPermission());

                        item.setSharedAt(
                                        share.getSharedAt());

                        item.setExpiresAt(
                                        share.getExpiresAt());

                        response.add(item);
                }

                return response;
        }

        // =========================================================
        // UPDATE PERMISSION
        // OWNER ONLY
        // =========================================================

        @Transactional
        public String updatePermission(
                        Long shareId,
                        UpdateSharePermissionRequest request,
                        String authenticatedEmail) {

                User owner = getAuthenticatedUser(
                                authenticatedEmail);

                if (request.getPermission() == null) {

                        throw new InvalidShareException(
                                        "Permission is required.");
                }

                CredentialShare share = credentialShareRepository
                                .findByIdAndOwner_IdAndActiveTrue(
                                                shareId,
                                                owner.getId())
                                .orElseThrow(() -> new CredentialNotFoundException(
                                                "Shared credential not found or access denied."));

                share.setPermission(
                                request.getPermission());

                credentialShareRepository.save(share);

                saveAudit(
                                "PERMISSION_CHANGE",
                                "CredentialShare",
                                share.getId(),
                                owner.getEmail());

                return "Permission updated successfully.";
        }
        // =========================================================
        // UPDATE PERMISSION - FULL MANAGEMENT RECIPIENT
        // =========================================================

        @Transactional
        public String updatePermissionAsManager(
                        Long shareId,
                        UpdateSharePermissionRequest request,
                        String authenticatedEmail) {

                User manager = getAuthenticatedUser(
                                authenticatedEmail);

                if (request.getPermission() == null) {

                        throw new InvalidShareException(
                                        "Permission is required.");
                }

                CredentialShare share = credentialShareRepository
                                .findActiveShareForRecipient(
                                                shareId,
                                                manager.getId())
                                .orElseThrow(() -> new CredentialNotFoundException(
                                                "Shared credential not found or access denied."));

                // Only FULL_MANAGEMENT can manage the share.
                if (share.getPermission() != SharePermission.FULL_MANAGEMENT) {

                        throw new InvalidShareException(
                                        "You do not have full management permission.");
                }

                share.setPermission(
                                request.getPermission());

                credentialShareRepository.save(share);

                saveAudit(
                                "PERMISSION_CHANGE",
                                "CredentialShare",
                                share.getId(),
                                manager.getEmail());

                return "Permission updated successfully.";
        }
        // =========================================================
        // REVOKE SHARE
        // OWNER ONLY
        // =========================================================

        @Transactional
        public String revokeShare(
                        Long shareId,
                        String authenticatedEmail) {

                User owner = getAuthenticatedUser(
                                authenticatedEmail);

                CredentialShare share = credentialShareRepository
                                .findByIdAndOwner_IdAndActiveTrue(
                                                shareId,
                                                owner.getId())
                                .orElseThrow(() -> new CredentialNotFoundException(
                                                "Shared credential not found or access denied."));

                share.setActive(false);

                credentialShareRepository.save(share);

                saveAudit(
                                "SHARE_REVOKED",
                                "CredentialShare",
                                share.getId(),
                                owner.getEmail());

                return "Credential sharing revoked successfully.";
        }

        // =========================================================
        // AUTHENTICATED USER
        // =========================================================

        private User getAuthenticatedUser(
                        String email) {

                return userRepository
                                .findByEmail(email)
                                .orElseThrow(() -> new UserNotFoundException(
                                                "Authenticated user not found."));
        }

        // =========================================================
        // AUDIT
        // =========================================================

        private void saveAudit(
                        String action,
                        String entityType,
                        Long entityId,
                        String performedBy) {

                AuditLog auditLog = new AuditLog();

                auditLog.setAction(action);
                auditLog.setEntityType(entityType);
                auditLog.setEntityId(entityId);
                auditLog.setPerformedBy(performedBy);
                auditLog.setTimestamp(
                                LocalDateTime.now());

                auditLogRepository.save(auditLog);
        }

}