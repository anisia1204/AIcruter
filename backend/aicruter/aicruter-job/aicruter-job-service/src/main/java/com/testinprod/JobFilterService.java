package com.testinprod;

import com.testinprod.entity.Job;
import com.testinprod.vo.JobFilters;
import org.springframework.data.jpa.domain.Specification;

public interface JobFilterService {
    Specification<Job> buildSpecification(JobFilters jobFilters);
}
