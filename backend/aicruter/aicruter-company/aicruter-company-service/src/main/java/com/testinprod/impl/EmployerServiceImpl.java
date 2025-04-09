package com.testinprod.impl;

import com.testinprod.EmployerService;
import com.testinprod.repository.EmployerJPARepository;
import org.springframework.stereotype.Service;

@Service
public class EmployerServiceImpl implements EmployerService {
    private final EmployerJPARepository jpaRepository;

    public EmployerServiceImpl(EmployerJPARepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
}
