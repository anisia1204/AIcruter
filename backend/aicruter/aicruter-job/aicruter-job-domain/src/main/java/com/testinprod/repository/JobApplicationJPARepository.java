package com.testinprod.repository;

import com.testinprod.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationJPARepository extends JpaRepository<JobApplication, Long> {
    Page<JobApplication> findAll(Specification<JobApplication> specification, Pageable pageable);
}
