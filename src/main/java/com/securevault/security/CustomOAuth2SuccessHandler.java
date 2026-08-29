package com.securevault.security;

import com.securevault.entity.User;
import com.securevault.repository.UserRepository;
import com.securevault.service.JwtService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import com.securevault.service.MfaService;

@Component
public class CustomOAuth2SuccessHandler
                implements AuthenticationSuccessHandler {

        private final UserRepository userRepository;

        private final MfaService mfaService;

        public CustomOAuth2SuccessHandler(
                        UserRepository userRepository,
                        MfaService mfaService) {

                this.userRepository = userRepository;
                this.mfaService = mfaService;
        }

        @Override
        public void onAuthenticationSuccess(
                        HttpServletRequest request,
                        HttpServletResponse response,
                        Authentication authentication)
                        throws IOException, ServletException {

                OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

                String email = oauth2User.getAttribute("email");

                if (email == null || email.isBlank()) {

                        response.sendError(
                                        HttpServletResponse.SC_UNAUTHORIZED,
                                        "Google account email could not be verified.");

                        return;
                }

                User user = userRepository.findByEmail(email)
                                .orElse(null);

                if (user == null) {

                        response.sendError(
                                        HttpServletResponse.SC_UNAUTHORIZED,
                                        "No SecureVault account exists for this Google email.");

                        return;
                }

                String otp = mfaService.generateOtp(user);

                mfaService.sendOtpEmail(
                                user.getEmail(),
                                otp);

                String frontendUrl = System.getenv("FRONTEND_URL");

                String redirectUrl = frontendUrl + "/oauth2/mfa?email="
                                + user.getEmail();

                response.sendRedirect(redirectUrl);
        }
}