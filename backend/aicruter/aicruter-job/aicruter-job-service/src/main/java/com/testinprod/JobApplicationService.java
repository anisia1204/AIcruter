package com.testinprod;

import com.testinprod.dto.JobApplicationDTO;
import com.testinprod.vo.JobApplicationVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface JobApplicationService {
    JobApplicationDTO save(JobApplicationDTO dto);
    Page<JobApplicationVO> getAllJobApplicationsOfCurrentUser(Pageable pageable, String status);
}
