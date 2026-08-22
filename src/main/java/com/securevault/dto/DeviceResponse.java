package com.securevault.dto;

import java.time.LocalDateTime;

public class DeviceResponse {

    private Long id;
    private String deviceName;
    private String ipAddress;
    private LocalDateTime lastLogin;

    public DeviceResponse(
            Long id,
            String deviceName,
            String ipAddress,
            LocalDateTime lastLogin) {

        this.id = id;
        this.deviceName = deviceName;
        this.ipAddress = ipAddress;
        this.lastLogin = lastLogin;
    }

    public Long getId() {
        return id;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public LocalDateTime getLastLogin() {
        return lastLogin;
    }
}