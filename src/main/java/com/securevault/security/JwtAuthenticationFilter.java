package com.securevault.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.securevault.service.JwtService;
import com.securevault.service.RevokedTokenService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

        private final JwtService jwtService;
        private final RevokedTokenService revokedTokenService;

        public JwtAuthenticationFilter(
                        JwtService jwtService,
                        RevokedTokenService revokedTokenService) {

                this.jwtService = jwtService;
                this.revokedTokenService = revokedTokenService;
        }

        @Override
        protected void doFilterInternal(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        FilterChain filterChain)
                        throws ServletException, IOException {

                String authHeader = request.getHeader("Authorization");

                // =========================================================
                // TEMPORARY DIAGNOSTIC LOGGING
                // =========================================================

                System.out.println(
                                "===== JWT REQUEST ===== " +
                                                request.getMethod() +
                                                " " +
                                                request.getRequestURI());

                System.out.println(
                                "Authorization header present: " +
                                                (authHeader != null));

                // =========================================================
                // NO JWT
                // =========================================================

                if (authHeader == null
                                || !authHeader.startsWith("Bearer ")) {

                        System.out.println(
                                        "No valid Bearer token found. Continuing filter chain.");

                        filterChain.doFilter(request, response);
                        return;
                }

                String jwt = authHeader.substring(7);

                // =========================================================
                // CHECK REVOKED TOKEN
                // =========================================================

                if (revokedTokenService.isRevoked(jwt)) {

                        System.out.println(
                                        "JWT rejected: token is revoked.");

                        SecurityContextHolder.clearContext();

                        response.setStatus(
                                        HttpServletResponse.SC_UNAUTHORIZED);

                        return;
                }

                try {

                        // =====================================================
                        // EXTRACT USERNAME
                        // =====================================================

                        String username = jwtService.extractUsername(jwt);

                        System.out.println(
                                        "JWT username extracted: " + username);

                        // =====================================================
                        // VALIDATE JWT
                        // =====================================================

                        boolean valid = username != null
                                        && jwtService.validateToken(jwt, username);

                        System.out.println(
                                        "JWT validation result: " + valid);

                        if (valid) {

                                // =================================================
                                // EXTRACT ROLE
                                // =================================================

                                String role = jwtService.extractRole(jwt);

                                System.out.println(
                                                "JWT role extracted: " + role);

                                // =================================================
                                // CREATE AUTHORITY
                                // =================================================

                                String authority = "ROLE_" + role;

                                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                                username,
                                                null,
                                                Collections.singletonList(
                                                                new SimpleGrantedAuthority(
                                                                                authority)));

                                // =================================================
                                // SET SECURITY CONTEXT
                                // =================================================

                                SecurityContextHolder
                                                .getContext()
                                                .setAuthentication(authentication);

                                System.out.println(
                                                "JWT authentication set successfully.");

                                System.out.println(
                                                "Authority: " + authority);

                                System.out.println(
                                                "===== JWT VALID =====");

                        } else {

                                System.out.println(
                                                "===== JWT INVALID =====");

                                SecurityContextHolder.clearContext();
                        }

                } catch (Exception exception) {

                        System.out.println(
                                        "===== JWT VALIDATION FAILED =====");

                        System.out.println(
                                        "Reason: " + exception.getClass().getSimpleName());

                        System.out.println(
                                        "Message: " + exception.getMessage());

                        SecurityContextHolder.clearContext();
                }

                filterChain.doFilter(request, response);
        }
}