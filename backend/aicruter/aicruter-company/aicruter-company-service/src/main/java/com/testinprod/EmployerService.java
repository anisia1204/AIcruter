package com.testinprod;

import com.testinprod.dto.CompanyDTO;
import com.testinprod.dto.EmployerDTO;
import com.testinprod.entity.Employer;

public interface EmployerService {
    EmployerDTO register(EmployerDTO employerDTO);
    Employer getByUserAccountId(Long id);
    CompanyDTO getCompanyTemplateByUserAccountId(Long userAccountId);
}
