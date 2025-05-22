package com.testinprod.impl;

import com.testinprod.JobFilterService;
import com.testinprod.entity.Job;
import com.testinprod.vo.JobFilters;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class JobFilterServiceImpl implements JobFilterService {
    @Override
    public Specification<Job> buildDefaultSpecification(JobFilters jobFilters) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (jobFilters.getTitle() != null && !jobFilters.getTitle().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("title")), "%" + jobFilters.getTitle().toLowerCase() + "%"));
            }

            if (jobFilters.getState() != null && !jobFilters.getState().isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("company").get("legalAddress").get("state")), "%" + jobFilters.getState().toLowerCase() + "%"));
            }

            if (jobFilters.getLocationType() != null) {
                predicates.add(criteriaBuilder.equal(root.get("locationType"), jobFilters.getLocationType()));
            }

            if (jobFilters.getEmploymentType() != null) {
                predicates.add(criteriaBuilder.equal(root.get("employmentType"), jobFilters.getEmploymentType()));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
