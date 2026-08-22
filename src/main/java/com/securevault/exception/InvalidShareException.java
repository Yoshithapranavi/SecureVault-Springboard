package com.securevault.exception;

public class InvalidShareException extends RuntimeException {

    public InvalidShareException(String message) {
        super(message);
    }
}