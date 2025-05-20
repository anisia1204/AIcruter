package com.testinprod;

import com.testinprod.dto.CompanyDTO;
import com.testinprod.entity.Company;

public interface CompanyService {
    Company getById(Long id);
    Company save(CompanyDTO companyDTO);
    CompanyDTO getTemplateById(Long id);
    CompanyDTO update(CompanyDTO companyDTO);
}
