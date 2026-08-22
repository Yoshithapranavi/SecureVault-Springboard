package com.securevault.dto;

public class PasswordGeneratorResponse {

    private String password;

    public PasswordGeneratorResponse() {
    }

    public PasswordGeneratorResponse(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}