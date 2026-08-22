package com.securevault.dto;

public class LoginResponse {

    private String token;
    private boolean mfaRequired;
    private String email;

    public LoginResponse() {
    }

    public LoginResponse(String token) {
        this.token = token;
        this.mfaRequired = false;
        this.email = null;
    }

    public LoginResponse(
            boolean mfaRequired,
            String email) {

        this.token = null;
        this.mfaRequired = mfaRequired;
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public boolean isMfaRequired() {
        return mfaRequired;
    }

    public void setMfaRequired(
            boolean mfaRequired) {

        this.mfaRequired = mfaRequired;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}