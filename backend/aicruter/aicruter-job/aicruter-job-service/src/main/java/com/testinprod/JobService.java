package com.testinprod;

import com.testinprod.dto.JobDTO;
import com.testinprod.entity.Job;

public interface JobService {
    JobDTO save(JobDTO jobDTO);
    Job getById(Long id);
}
