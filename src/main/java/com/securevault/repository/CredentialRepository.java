package com.securevault.repository;

import com.securevault.entity.Credential;
import com.securevault.enums.Category;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CredentialRepository extends JpaRepository<Credential, Long>,
                JpaSpecificationExecutor<Credential> {
        long countByUserIdAndDeletedFalse(Long userId);

        // Find a credential by its ID, owner ID, and only if not deleted
        Optional<Credential> findByIdAndUserIdAndDeletedFalse(Long credentialId, Long userId);

        // Find all active credentials belonging to a specific user
        @EntityGraph(attributePaths = "user")
        List<Credential> findByUserIdAndDeletedFalse(Long userId);

        // Pagination (excluding deleted credentials)
        Page<Credential> findByUserIdAndDeletedFalse(Long userId, Pageable pageable);

        // Filter by category (excluding deleted credentials)
        List<Credential> findByUserIdAndCategoryAndDeletedFalse(Long userId, Category category);

        // Search active credentials
        @Query("""
                        SELECT c
                        FROM Credential c
                        WHERE c.user.id = :userId
                        AND c.deleted = false
                        AND (
                            LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
                            OR LOWER(c.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
                            OR LOWER(c.websiteUrl) LIKE LOWER(CONCAT('%', :keyword, '%'))
                        )
                        """)
        List<Credential> searchCredentials(
                        @Param("userId") Long userId,
                        @Param("keyword") String keyword);

        // Fetch active credentials with user
        @Query("""
                        SELECT c
                        FROM Credential c
                        JOIN FETCH c.user
                        WHERE c.user.id = :userId
                        AND c.deleted = false
                        """)
        List<Credential> findAllWithUser(@Param("userId") Long userId);

        // ===========================
        // Trash / Restore Support
        // ===========================

        // Get all deleted credentials (Trash)
        List<Credential> findByUserIdAndDeletedTrue(Long userId);

        // Find one deleted credential
        Optional<Credential> findByIdAndDeletedTrue(Long id);

        @Query("""
                            SELECT c
                            FROM Credential c
                            JOIN FETCH c.user
                            WHERE c.id = :credentialId
                        """)
        Optional<Credential> findCredentialWithUser(@Param("credentialId") Long credentialId);

}