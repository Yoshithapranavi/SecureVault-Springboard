package com.securevault.controller;

import com.securevault.dto.DeviceResponse;
import com.securevault.response.ApiResponse;
import com.securevault.service.DeviceService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(
            DeviceService deviceService) {

        this.deviceService = deviceService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DeviceResponse>>> getDevices(
            Authentication authentication) {

        List<DeviceResponse> devices = deviceService.getDevices(
                authentication.getName());

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Devices fetched successfully.",
                        devices));
    }

    @DeleteMapping("/{deviceId}")
    public ResponseEntity<ApiResponse<String>> removeDevice(
            @PathVariable Long deviceId,
            Authentication authentication) {

        deviceService.removeDevice(
                deviceId,
                authentication.getName());

        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Device removed successfully.",
                        null));
    }
}