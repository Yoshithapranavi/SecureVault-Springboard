package com.securevault.exception;

public class CredentialNotFoundException extends RuntimeException {

    public CredentialNotFoundException(String message) {
        super(message);
    }
}