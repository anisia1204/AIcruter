package com.testinprod;

import com.testinprod.dto.JobApplicationDTO;
import com.testinprod.dto.JobApplicationStatusChangeDTO;
import com.testinprod.entity.JobApplication;
import com.testinprod.vo.JobApplicationVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobApplicationService {
    JobApplicationDTO save(JobApplicationDTO dto);
    Page<JobApplicationVO> getAllJobApplicationsOfCurrentUser(Pageable pageable, String status);
    Page<JobApplicationVO> getJobApplicationsByJobId(Pageable pageable, String status, String jobId);
    JobApplication getById(Long id);
    JobApplicationStatusChangeDTO updateStatus(JobApplicationStatusChangeDTO jobApplicationStatusChangeDTO);
}
