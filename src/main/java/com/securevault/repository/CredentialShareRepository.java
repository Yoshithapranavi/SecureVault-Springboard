package com.securevault.repository;

import com.securevault.entity.Credential;
import com.securevault.entity.CredentialShare;
import com.securevault.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CredentialShareRepository
    extends JpaRepository<CredentialShare, Long> {

  // =========================================================
  // COUNT ACTIVE SHARES OWNED BY USER
  // =========================================================

  long countByOwner_IdAndActiveTrue(Long ownerId);

  // =========================================================
  // GET ACTIVE CREDENTIALS SHARED WITH USER
  // =========================================================

  @Query("""
          SELECT cs
          FROM CredentialShare cs
          JOIN FETCH cs.credential c
          JOIN FETCH cs.owner o
          WHERE cs.sharedWith.id = :userId
      AND cs.active = true
      AND (cs.expiresAt IS NULL OR cs.expiresAt > CURRENT_TIMESTAMP)
          ORDER BY cs.sharedAt DESC
          """)
  List<CredentialShare> findActiveSharesWithDetails(
      @Param("userId") Long userId);

  // =========================================================
  // FIND ACTIVE SHARE
  // =========================================================

  @Query("""
      SELECT cs
      FROM CredentialShare cs
      WHERE cs.credential = :credential
        AND cs.sharedWith = :sharedWith
        AND cs.active = true
        AND (cs.expiresAt IS NULL OR cs.expiresAt > CURRENT_TIMESTAMP)
      """)
  Optional<CredentialShare> findActiveShare(
      @Param("credential") Credential credential,
      @Param("sharedWith") User sharedWith);

  // =========================================================
  // GET ACTIVE SHARES FOR CREDENTIAL OWNER
  // =========================================================

  @Query("""
          SELECT cs
          FROM CredentialShare cs
          JOIN FETCH cs.sharedWith sw
          WHERE cs.credential.id = :credentialId
      AND cs.owner.id = :ownerId
      AND cs.active = true
      AND (cs.expiresAt IS NULL OR cs.expiresAt > CURRENT_TIMESTAMP)
          ORDER BY cs.sharedAt DESC
          """)
  List<CredentialShare> findActiveSharesForOwner(
      @Param("credentialId") Long credentialId,
      @Param("ownerId") Long ownerId);

  // =========================================================
  // FIND SHARE BY ID AND OWNER
  // =========================================================

  Optional<CredentialShare> findByIdAndOwner_IdAndActiveTrue(
      Long shareId,
      Long ownerId);
  // =========================================================
  // DELETE ALL SHARES FOR A CREDENTIAL
  // USED BEFORE PERMANENT CREDENTIAL DELETION
  // =========================================================

  void deleteByCredentialId(Long credentialId);

  @Query("""
      SELECT cs
      FROM CredentialShare cs
      WHERE cs.id = :shareId
        AND cs.sharedWith.id = :userId
        AND cs.active = true
        AND (cs.expiresAt IS NULL OR cs.expiresAt > CURRENT_TIMESTAMP)
      """)
  Optional<CredentialShare> findActiveShareForRecipient(
      @Param("shareId") Long shareId,
      @Param("userId") Long userId);

}
