package com.testinprod.repository;

import com.testinprod.entity.Company;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;

import java.util.List;

public interface CompanyJPARepository extends JpaRepository<Company, Long> {
    List<Company> findAllByOrderByNameAsc();
    Page<Company> findAll(Specification<Company> specification, Pageable pageable);
}
