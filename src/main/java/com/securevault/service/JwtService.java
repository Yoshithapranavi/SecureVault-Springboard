package com.securevault.service;

import com.securevault.enums.Role;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

import javax.crypto.SecretKey;
import java.util.UUID;

@Service
public class JwtService {

        @Value("${jwt.secret}")
        private String secret;

        @Value("${jwt.expiration}")
        private long expiration;

        private SecretKey getSigningKey() {

                return Keys.hmacShaKeyFor(
                                secret.getBytes());
        }

        // =========================================================
        // GENERATE TOKEN
        // =========================================================

        public String generateToken(
                        String username,
                        Role role) {

                return Jwts.builder()

                                // User email
                                .subject(username)
                                .id(UUID.randomUUID().toString())

                                // User role
                                .claim(
                                                "role",
                                                role.name())

                                .issuedAt(
                                                new Date())

                                .expiration(
                                                new Date(
                                                                System.currentTimeMillis()
                                                                                + expiration))

                                .signWith(
                                                getSigningKey())

                                .compact();
        }

        // =========================================================
        // EXTRACT USERNAME
        // =========================================================

        public String extractUsername(
                        String token) {

                return extractAllClaims(token)
                                .getSubject();
        }

        // =========================================================
        // EXTRACT ROLE
        // =========================================================

        public String extractRole(
                        String token) {

                return extractAllClaims(token)
                                .get("role", String.class);
        }

        public String extractTokenId(
                        String token) {

                return extractAllClaims(token)
                                .getId();
        }

        // =========================================================
        // EXTRACT CLAIMS
        // =========================================================

        private Claims extractAllClaims(
                        String token) {

                return Jwts.parser()

                                .verifyWith(
                                                getSigningKey())

                                .build()

                                .parseSignedClaims(
                                                token)

                                .getPayload();
        }

        // =========================================================
        // EXPIRATION
        // =========================================================

        public Date extractExpiration(
                        String token) {

                return extractAllClaims(token)
                                .getExpiration();
        }

        public boolean isTokenExpired(
                        String token) {

                return extractExpiration(token)
                                .before(new Date());
        }

        // =========================================================
        // VALIDATE TOKEN
        // =========================================================

        public boolean validateToken(
                        String token,
                        String username) {

                String extractedUsername = extractUsername(token);

                return extractedUsername.equals(username)
                                && !isTokenExpired(token);
        }
}