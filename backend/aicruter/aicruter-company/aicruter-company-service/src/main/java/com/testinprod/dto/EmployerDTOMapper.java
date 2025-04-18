package com.testinprod.dto;

import com.testinprod.entity.Employer;
import org.springframework.stereotype.Component;

@Component
public class EmployerDTOMapper {
    private final UserAccountDTOMapper userAccountDTOMapper;
    private final CompanyDTOMapper companyDTOMapper;

    public EmployerDTOMapper(UserAccountDTOMapper userAccountDTOMapper, CompanyDTOMapper companyDTOMapper) {
        this.userAccountDTOMapper = userAccountDTOMapper;
        this.companyDTOMapper = companyDTOMapper;
    }

    public EmployerDTO getDTOFromEntity(Employer employer) {
        EmployerDTO employerDTO = new EmployerDTO();
        employerDTO.setId(employer.getId());
        employerDTO.setRole(employer.getRole());
        employerDTO.setUserAccountDTO(userAccountDTOMapper.getDTOFromEntity(employer.getUserAccount()));
        employerDTO.setCompanyDTO(companyDTOMapper.getDTOFromEntity(employer.getCompany()));
        return employerDTO;
    }
}
