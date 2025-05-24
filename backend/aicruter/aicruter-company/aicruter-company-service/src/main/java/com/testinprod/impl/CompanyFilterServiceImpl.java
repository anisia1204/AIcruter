package com.testinprod.impl;

import com.testinprod.CompanyFilterService;
import com.testinprod.entity.Company;
import com.testinprod.vo.CompanyFilters;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CompanyFilterServiceImpl implements CompanyFilterService {
    @Override
    public Specification<Company> buildSpecification(CompanyFilters companyFilters) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (companyFilters.getName() != null && !companyFilters.getName().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + companyFilters.getName().toLowerCase() + "%"));
            }

            if (companyFilters.getCity() != null && !companyFilters.getCity().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("legalAddress").get("city")), "%" + companyFilters.getCity().toLowerCase() + "%"));
            }

            if (companyFilters.getState() != null && !companyFilters.getState().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("legalAddress").get("state")), "%" + companyFilters.getState().toLowerCase() + "%"));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
