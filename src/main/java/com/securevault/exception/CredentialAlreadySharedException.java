package com.securevault.exception;

public class CredentialAlreadySharedException extends RuntimeException {

    public CredentialAlreadySharedException(String message) {
        super(message);
    }
}