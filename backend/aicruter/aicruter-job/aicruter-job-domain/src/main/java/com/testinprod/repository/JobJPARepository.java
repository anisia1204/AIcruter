package com.testinprod.repository;

import com.testinprod.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface JobJPARepository extends JpaRepository<Job, Long> {
    Page<Job> findAll(Specification<Job> specification, Pageable pageable);

    @Query("select distinct address.state from Job job join job.company company join company.legalAddress address where address.state is not null")
    List<String> findAllDistinctStatesAssociatedToJobs();
}
