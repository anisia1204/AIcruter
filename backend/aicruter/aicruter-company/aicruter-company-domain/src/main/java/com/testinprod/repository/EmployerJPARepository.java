package com.testinprod.repository;

import com.testinprod.entity.Employer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployerJPARepository extends JpaRepository<Employer, Long> {
    Employer findByUserAccountId(Long id);
}
