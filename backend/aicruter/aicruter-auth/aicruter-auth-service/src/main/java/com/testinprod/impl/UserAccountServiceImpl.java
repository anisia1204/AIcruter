package com.testinprod.impl;

import com.testinprod.UserAccountService;
import com.testinprod.repository.UserAccountJPARepository;
import org.springframework.stereotype.Service;

@Service
public class UserAccountServiceImpl implements UserAccountService {
    private final UserAccountJPARepository jpaRepository;

    public UserAccountServiceImpl(UserAccountJPARepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }
}
