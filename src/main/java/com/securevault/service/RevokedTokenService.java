package com.securevault.service;

import com.securevault.entity.RevokedToken;
import com.securevault.repository.RevokedTokenRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class RevokedTokenService {

    private final RevokedTokenRepository revokedTokenRepository;

    public RevokedTokenService(
            RevokedTokenRepository revokedTokenRepository) {

        this.revokedTokenRepository = revokedTokenRepository;
    }

    @Transactional
    public void revokeToken(
            String token,
            LocalDateTime expiresAt) {

        if (token == null || token.isBlank()) {
            return;
        }

        if (revokedTokenRepository.existsByToken(token)) {
            return;
        }

        RevokedToken revokedToken = new RevokedToken();

        revokedToken.setToken(token);
        revokedToken.setExpiresAt(expiresAt);

        revokedTokenRepository.save(
                revokedToken);
    }

    public boolean isRevoked(String token) {

        if (token == null || token.isBlank()) {
            return false;
        }

        return revokedTokenRepository
                .existsByToken(token);
    }

    @Transactional
    public void deleteExpiredTokens() {

        revokedTokenRepository
                .deleteByExpiresAtBefore(
                        LocalDateTime.now());
    }
}