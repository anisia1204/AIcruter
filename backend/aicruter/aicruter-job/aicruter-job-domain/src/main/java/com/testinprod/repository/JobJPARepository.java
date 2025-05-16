package com.testinprod.repository;

import com.testinprod.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobJPARepository extends JpaRepository<Job, Long> {
    Page<Job> findAll(Specification<Job> specification, Pageable pageable);
}
