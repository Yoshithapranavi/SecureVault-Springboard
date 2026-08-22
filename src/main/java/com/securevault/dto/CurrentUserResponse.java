package com.securevault.dto;

import com.securevault.enums.Role;
import com.securevault.entity.User;

public class CurrentUserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;

    public CurrentUserResponse() {
    }

    public CurrentUserResponse(
            Long id,
            String name,
            String email,
            Role role) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}