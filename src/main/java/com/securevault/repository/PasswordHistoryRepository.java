package com.securevault.repository;

import com.securevault.entity.PasswordHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PasswordHistoryRepository extends JpaRepository<PasswordHistory, Long> {

    // Returns the latest 5 password history records
    List<PasswordHistory> findTop5ByCredentialIdOrderByVersionDesc(Long credentialId);

    // Returns the latest password history record
    PasswordHistory findTopByCredentialIdOrderByVersionDesc(Long credentialId);

    // Returns all password history records of a credential
    List<PasswordHistory> findByCredentialIdOrderByVersionDesc(Long credentialId);

    void deleteByCredentialId(Long credentialId);

}