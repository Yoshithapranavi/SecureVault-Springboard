package com.securevault.dto;

public class MfaVerifyResponse {

    private String token;

    public MfaVerifyResponse() {
    }

    public MfaVerifyResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}