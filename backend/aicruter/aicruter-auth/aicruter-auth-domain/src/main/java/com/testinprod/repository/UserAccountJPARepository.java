package com.testinprod.repository;

import com.testinprod.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserAccountJPARepository extends JpaRepository<UserAccount, Long> {
}
