package com.testinprod.repository;

import com.testinprod.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CompanyJPARepository extends JpaRepository<Company, Long> {
}
