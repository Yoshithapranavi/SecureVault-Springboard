package com.securevault.repository;

import com.securevault.entity.MfaOtp;
import com.securevault.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MfaOtpRepository
        extends JpaRepository<MfaOtp, Long> {

    Optional<MfaOtp> findTopByUserAndVerifiedFalseOrderByCreatedAtDesc(
            User user);
}