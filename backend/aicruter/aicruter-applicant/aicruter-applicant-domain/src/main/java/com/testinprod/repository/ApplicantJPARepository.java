package com.testinprod.repository;

import com.testinprod.entity.UserAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicantJPARepository extends JpaRepository<Applicant, Long> {
}
