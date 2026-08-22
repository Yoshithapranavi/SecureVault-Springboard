package com.securevault.repository;

import com.securevault.entity.Device;
import com.securevault.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceRepository
        extends JpaRepository<Device, Long> {

    List<Device> findByUserOrderByLastLoginDesc(User user);

    Optional<Device> findByUserAndDeviceNameAndIpAddress(
            User user,
            String deviceName,
            String ipAddress);

    Optional<Device> findByIdAndUser(
            Long id,
            User user);
}