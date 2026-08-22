package com.securevault.dto;

import com.securevault.enums.SharePermission;

public class UpdateSharePermissionRequest {

    private SharePermission permission;

    public SharePermission getPermission() {
        return permission;
    }

    public void setPermission(SharePermission permission) {
        this.permission = permission;
    }

}