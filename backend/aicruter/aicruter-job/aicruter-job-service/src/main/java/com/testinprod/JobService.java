package com.testinprod;

import com.testinprod.dto.JobDTO;
import com.testinprod.dto.JobStatusChangeDTO;
import com.testinprod.entity.JobStatus;
import com.testinprod.vo.JobFilters;
import com.testinprod.vo.JobVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.testinprod.entity.Job;

import java.util.List;

public interface JobService {
    JobDTO save(JobDTO jobDTO);
    Page<JobVO> getAllJobs(JobFilters jobFilters, Pageable pageable);
    Page<JobVO> getAllJobsByCurrentCompany(JobFilters jobFilters, Pageable pageable);
    Job getById(Long id);
    JobVO getTemplateById(Long id);
    List<String> getAllDistinctStatesAssociatedToJobs();
    JobStatus updateStatus(JobStatusChangeDTO jobStatusChangeDTO);
}
