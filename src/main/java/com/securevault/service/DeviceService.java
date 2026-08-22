package com.securevault.service;

import com.securevault.dto.DeviceResponse;
import com.securevault.entity.Device;
import com.securevault.entity.User;
import com.securevault.repository.DeviceRepository;
import com.securevault.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    public DeviceService(
            DeviceRepository deviceRepository,
            UserRepository userRepository) {

        this.deviceRepository = deviceRepository;

        this.userRepository = userRepository;
    }

    @Transactional
    public void recordLoginDevice(
            User user,
            String ipAddress,
            String userAgent) {

        String deviceName = getDeviceName(userAgent);

        Device device = deviceRepository
                .findByUserAndDeviceNameAndIpAddress(
                        user,
                        deviceName,
                        ipAddress)
                .orElseGet(() -> {

                    Device newDevice = new Device();

                    newDevice.setUser(user);
                    newDevice.setDeviceName(
                            deviceName);
                    newDevice.setIpAddress(
                            ipAddress);

                    return newDevice;
                });

        device.setLastLogin(
                LocalDateTime.now());

        deviceRepository.save(device);
    }

    public List<DeviceResponse> getDevices(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        return deviceRepository
                .findByUserOrderByLastLoginDesc(user)
                .stream()
                .map(device -> new DeviceResponse(
                        device.getId(),
                        device.getDeviceName(),
                        device.getIpAddress(),
                        device.getLastLogin()))
                .toList();
    }

    @Transactional
    public void removeDevice(
            Long deviceId,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException(
                        "User not found."));

        Device device = deviceRepository
                .findByIdAndUser(
                        deviceId,
                        user)
                .orElseThrow(() -> new RuntimeException(
                        "Device not found."));

        deviceRepository.delete(device);
    }

    private String getDeviceName(
            String userAgent) {

        if (userAgent == null ||
                userAgent.isBlank()) {

            return "Unknown Device";
        }

        String lower = userAgent.toLowerCase();

        String browser;

        if (lower.contains("edg")) {
            browser = "Microsoft Edge";
        } else if (lower.contains("chrome")) {
            browser = "Google Chrome";
        } else if (lower.contains("firefox")) {
            browser = "Mozilla Firefox";
        } else if (lower.contains("safari")) {
            browser = "Safari";
        } else {
            browser = "Web Browser";
        }

        String os;

        if (lower.contains("windows")) {
            os = "Windows";
        } else if (lower.contains("android")) {
            os = "Android";
        } else if (lower.contains("iphone") ||
                lower.contains("ipad")) {
            os = "iOS";
        } else if (lower.contains("mac")) {
            os = "macOS";
        } else if (lower.contains("linux")) {
            os = "Linux";
        } else {
            os = "Unknown OS";
        }

        return browser + " on " + os;
    }
}