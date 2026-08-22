package com.securevault.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import com.securevault.security.CustomOAuth2SuccessHandler;
import com.securevault.security.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthenticationFilter;
        private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;

        public SecurityConfig(
                        JwtAuthenticationFilter jwtAuthenticationFilter,
                        CustomOAuth2SuccessHandler customOAuth2SuccessHandler) {

                this.jwtAuthenticationFilter = jwtAuthenticationFilter;
                this.customOAuth2SuccessHandler = customOAuth2SuccessHandler;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(
                        HttpSecurity http) throws Exception {

                http
                                // Enable CORS using CorsConfigurationSource
                                .cors(cors -> {
                                })

                                // CSRF is not required for JWT-based API authentication
                                .csrf(csrf -> csrf.disable())

                                // JWT authentication is stateless
                                .sessionManagement(session -> session.sessionCreationPolicy(
                                                SessionCreationPolicy.IF_REQUIRED))

                                .authorizeHttpRequests(auth -> auth

                                                // Allow CORS preflight requests
                                                .requestMatchers(
                                                                HttpMethod.OPTIONS,
                                                                "/**")
                                                .permitAll()

                                                // Public authentication endpoints
                                                .requestMatchers(
                                                                "/api/auth/register",
                                                                "/api/auth/login",
                                                                "/api/auth/mfa/verify",
                                                                "/api/auth/password/forgot",
                                                                "/api/auth/password/reset")
                                                .permitAll()

                                                // Everything else requires authentication
                                                .anyRequest()
                                                .authenticated())

                                // Disable HTTP Basic authentication
                                .httpBasic(httpBasic -> httpBasic.disable())

                                // JWT authentication MUST run before
                                // UsernamePasswordAuthenticationFilter
                                .addFilterBefore(
                                                jwtAuthenticationFilter,
                                                UsernamePasswordAuthenticationFilter.class)

                                // Google OAuth2 login
                                .oauth2Login(oauth2 -> oauth2.successHandler(
                                                customOAuth2SuccessHandler));

                return http.build();
        }
}