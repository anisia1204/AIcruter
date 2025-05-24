package com.testinprod;

import com.testinprod.entity.Company;
import com.testinprod.vo.CompanyFilters;
import org.springframework.data.jpa.domain.Specification;

public interface CompanyFilterService {
    Specification<Company> buildSpecification(CompanyFilters companyFilters);
}
