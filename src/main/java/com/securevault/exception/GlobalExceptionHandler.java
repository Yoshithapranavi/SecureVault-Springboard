package com.securevault.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.securevault.response.ApiResponse;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.MethodArgumentNotValidException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authorization.AuthorizationDeniedException;

@ControllerAdvice
public class GlobalExceptionHandler {
        private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

        @ExceptionHandler(UserNotFoundException.class)
        public ResponseEntity<ApiResponse<String>> handleUserNotFound(
                        UserNotFoundException ex) {
                logger.error(
                                "UserNotFoundException: {}",
                                ex.getMessage());
                logger.error(
                                "CredentialNotFoundException: {}",
                                ex.getMessage());

                ApiResponse<String> response = new ApiResponse<>(false, ex.getMessage(), null);

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(response);
        }

        @ExceptionHandler(CredentialNotFoundException.class)
        public ResponseEntity<ApiResponse<String>> handleCredentialNotFound(
                        CredentialNotFoundException ex) {

                ApiResponse<String> response = new ApiResponse<>(false, ex.getMessage(), null);

                return ResponseEntity
                                .status(HttpStatus.NOT_FOUND)
                                .body(response);
        }

        @ExceptionHandler(DuplicateEmailException.class)
        public ResponseEntity<ApiResponse<String>> handleDuplicateEmail(
                        DuplicateEmailException ex) {
                logger.error(
                                "DuplicateEmailException: {}",
                                ex.getMessage());

                ApiResponse<String> response = new ApiResponse<>(false, ex.getMessage(), null);

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(response);
        }

        @ExceptionHandler(InvalidCredentialsException.class)
        public ResponseEntity<ApiResponse<String>> handleInvalidCredentials(
                        InvalidCredentialsException ex) {
                logger.error(
                                "InvalidCredentialsException: {}",
                                ex.getMessage());

                ApiResponse<String> response = new ApiResponse<>(false, ex.getMessage(), null);

                return ResponseEntity
                                .status(HttpStatus.UNAUTHORIZED)
                                .body(response);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
                        MethodArgumentNotValidException ex) {
                logger.error(
                                "Validation failed with {} error(s).",
                                ex.getBindingResult().getFieldErrorCount());

                Map<String, String> errors = new HashMap<>();

                ex.getBindingResult()
                                .getFieldErrors()
                                .forEach(error -> errors.put(
                                                error.getField(),
                                                error.getDefaultMessage()));

                ApiResponse<Map<String, String>> response = new ApiResponse<>(
                                false,
                                "Validation Failed",
                                errors);

                return ResponseEntity
                                .badRequest()
                                .body(response);
        }

        @ExceptionHandler(PasswordReuseException.class)
        public ResponseEntity<ApiResponse<String>> handlePasswordReuseException(
                        PasswordReuseException ex) {
                logger.error(
                                "PasswordReuseException: {}",
                                ex.getMessage());

                ApiResponse<String> response = new ApiResponse<>(false, ex.getMessage(), null);

                return ResponseEntity.status(HttpStatus.CONFLICT)
                                .body(response);
        }

        @ExceptionHandler(CredentialAlreadySharedException.class)
        public ResponseEntity<ApiResponse<String>> handleCredentialAlreadyShared(
                        CredentialAlreadySharedException ex) {
                logger.error(
                                "CredentialAlreadySharedException: {}",
                                ex.getMessage());

                ApiResponse<String> response = new ApiResponse<>(
                                false,
                                ex.getMessage(),
                                null);

                return ResponseEntity
                                .status(HttpStatus.CONFLICT)
                                .body(response);
        }

        @ExceptionHandler(InvalidShareException.class)
        public ResponseEntity<ApiResponse<String>> handleInvalidShare(
                        InvalidShareException ex) {
                logger.error(
                                "InvalidShareException: {}",
                                ex.getMessage());

                ApiResponse<String> response = new ApiResponse<>(
                                false,
                                ex.getMessage(),
                                null);

                return ResponseEntity
                                .status(HttpStatus.BAD_REQUEST)
                                .body(response);
        }

        @ExceptionHandler(AuthorizationDeniedException.class)
        public ResponseEntity<ApiResponse<String>> handleAuthorizationDenied(
                        AuthorizationDeniedException ex) {

                logger.warn(
                                "Authorization denied: {}",
                                ex.getMessage());

                ApiResponse<String> response = new ApiResponse<>(
                                false,
                                "Access denied.",
                                null);

                return ResponseEntity
                                .status(HttpStatus.FORBIDDEN)
                                .body(response);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ApiResponse<String>> handleGenericException(Exception ex) {

                logger.error(
                                "Unexpected exception occurred.",
                                ex);

                ApiResponse<String> response = new ApiResponse<>(
                                false,
                                "An unexpected error occurred. Please try again later.",
                                null);

                return ResponseEntity
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(response);
        }
}