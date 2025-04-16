package com.testinprod.impl;

import com.testinprod.CompanyService;
import com.testinprod.ConfirmationTokenService;
import com.testinprod.EmployerService;
import com.testinprod.UserAccountService;
import com.testinprod.dto.EmployerDTO;
import com.testinprod.dto.EmployerDTOMapper;
import com.testinprod.entity.Company;
import com.testinprod.entity.EmployeeRole;
import com.testinprod.entity.Employer;
import com.testinprod.entity.UserAccount;
import com.testinprod.repository.EmployerJPARepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EmployerServiceImpl implements EmployerService {
    private final EmployerJPARepository jpaRepository;
    private final UserAccountService userAccountService;
    private final EmployerDTOMapper employerDTOMapper;
    private final ConfirmationTokenService confirmationTokenService;
    private final CompanyService companyService;

    public EmployerServiceImpl(EmployerJPARepository jpaRepository, UserAccountService userAccountService, EmployerDTOMapper employerDTOMapper, ConfirmationTokenService confirmationTokenService, CompanyService companyService) {
        this.jpaRepository = jpaRepository;
        this.userAccountService = userAccountService;
        this.employerDTOMapper = employerDTOMapper;
        this.confirmationTokenService = confirmationTokenService;
        this.companyService = companyService;
    }

    @Override
    @Transactional
    public EmployerDTO register(EmployerDTO employerDTO) {
        UserAccount userAccount = userAccountService.save(employerDTO.getUserAccountDTO());
        Employer employer = save(employerDTO, userAccount);
        confirmationTokenService.generateTokenAndSendEmailConfirmationToUser(userAccount);
        return employerDTOMapper.getDTOFromEntity(employer);
    }

    @Transactional
    public Employer save(EmployerDTO employerDTO, UserAccount userAccount) {
        Employer employer = new Employer();
        employer.setUserAccount(userAccount);
        Company company = null;
        if(employerDTO.getCompanyDTO().getId() != null) {
            company = companyService.getById(employerDTO.getCompanyDTO().getId());
            employer.setRole(EmployeeRole.ADMIN);
        }
        else {
            company = companyService.save(employerDTO.getCompanyDTO());
            employer.setRole(EmployeeRole.OWNER);
        }
        employer.setCompany(company);
        company.getEmployees().add(employer);
        return persist(employer);
    }

    private Employer persist(Employer employer) {
        return jpaRepository.save(employer);
    }
}
