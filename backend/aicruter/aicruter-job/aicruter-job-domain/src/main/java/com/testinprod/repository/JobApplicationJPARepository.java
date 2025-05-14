package com.testinprod.repository;

import com.testinprod.entity.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationJPARepository extends JpaRepository<JobApplication, Long> {
}
