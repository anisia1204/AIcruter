package com.testinprod.impl;

import com.testinprod.ApplicantService;
import com.testinprod.repository.ApplicantJPARepository;
import org.springframework.stereotype.Service;

@Service
public class ApplicantServiceImpl implements ApplicantService {
    private final ApplicantJPARepository jpaRepository;

    public ApplicantServiceImpl(ApplicantJPARepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
}
