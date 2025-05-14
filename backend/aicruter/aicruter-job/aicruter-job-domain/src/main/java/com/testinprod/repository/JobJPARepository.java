package com.testinprod.repository;

import com.testinprod.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobJPARepository extends JpaRepository<Job, Long> {
}
