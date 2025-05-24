package com.testinprod.repository;

import com.testinprod.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CompanyJPARepository extends JpaRepository<Company, Long> {
    List<Company> findAllByOrderByNameAsc();
}
