package com.securevault.repository;

import com.securevault.entity.RevokedToken;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface RevokedTokenRepository
        extends JpaRepository<RevokedToken, Long> {

    boolean existsByToken(String token);

    void deleteByExpiresAtBefore(
            LocalDateTime dateTime);
}