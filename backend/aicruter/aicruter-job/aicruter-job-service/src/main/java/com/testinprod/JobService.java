package com.testinprod;

import com.testinprod.dto.JobDTO;
import com.testinprod.vo.JobFilters;
import com.testinprod.vo.JobVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.testinprod.entity.Job;

public interface JobService {
    JobDTO save(JobDTO jobDTO);
    Page<JobVO> getAllJobs(JobFilters jobFilters, Pageable pageable);
    Job getById(Long id);
}
