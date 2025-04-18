package com.testinprod.repository;

import com.testinprod.entity.ConfirmationToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConfirmationTokenJPARepository extends JpaRepository<ConfirmationToken, Long> {
    Optional<ConfirmationToken> findByToken(String token);
    ConfirmationToken findByUserAccountId(Long userId);
}
