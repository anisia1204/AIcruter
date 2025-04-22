package com.testinprod.repository;

import com.testinprod.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeJPARepository extends JpaRepository<Resume, Long> {
}
