package com.testinprod.impl;

import com.testinprod.ApplicantService;
import com.testinprod.JobApplicationService;
import com.testinprod.JobService;
import com.testinprod.context.UserContextHolder;
import com.testinprod.dto.JobApplicationDTO;
import com.testinprod.dto.JobApplicationDTOMapper;
import com.testinprod.entity.JobApplication;
import com.testinprod.entity.JobApplicationStatus;
import com.testinprod.repository.JobApplicationJPARepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {
    private final JobApplicationJPARepository jpaRepository;
    private final JobService jobService;
    private final ApplicantService applicantService;
    private final JobApplicationDTOMapper dtoMapper;

    public JobApplicationServiceImpl(JobApplicationJPARepository jpaRepository, JobService jobService, ApplicantService applicantService, JobApplicationDTOMapper dtoMapper) {
        this.jpaRepository = jpaRepository;
        this.jobService = jobService;
        this.applicantService = applicantService;
        this.dtoMapper = dtoMapper;
    }

    @Override
    @Transactional
    public JobApplicationDTO save(JobApplicationDTO dto) {
        JobApplication jobApplication = new JobApplication();
        jobApplication.setJob(jobService.getById(dto.getJobId()));
        jobApplication.setApplicant(applicantService.getByUserAccountId(UserContextHolder.getUserContext().getUserId()));
        jobApplication.setCreatedAt(LocalDateTime.now());
        jobApplication.setStatus(JobApplicationStatus.NEW);

        persist(jobApplication);
        return dtoMapper.getDTOFromEntity(jobApplication);
    }

    private void persist(JobApplication jobApplication) {
        jpaRepository.save(jobApplication);
    }
}
