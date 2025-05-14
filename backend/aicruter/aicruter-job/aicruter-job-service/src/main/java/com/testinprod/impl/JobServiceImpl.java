package com.testinprod.impl;

import com.testinprod.CompanyService;
import com.testinprod.JobService;
import com.testinprod.dto.JobDTO;
import com.testinprod.dto.JobDTOMapper;
import com.testinprod.entity.Job;
import com.testinprod.entity.JobStatus;
import com.testinprod.exception.JobNotFoundException;
import com.testinprod.repository.JobJPARepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class JobServiceImpl implements JobService {
    private final JobJPARepository jpaRepository;
    private final JobDTOMapper jobDTOMapper;
    private final CompanyService companyService;

    public JobServiceImpl(JobJPARepository jpaRepository, JobDTOMapper jobDTOMapper, CompanyService companyService) {
        this.jpaRepository = jpaRepository;
        this.jobDTOMapper = jobDTOMapper;
        this.companyService = companyService;
    }

    @Override
    @Transactional
    public JobDTO save(JobDTO jobDTO) {
        Job job = jobDTOMapper.getEntityFromDTO(jobDTO);

        job.setCreatedAt(LocalDateTime.now());
        job.setStatus(JobStatus.OPEN);
        job.setCompany(companyService.getById(jobDTO.getCompanyId()));

        persist(job);
        return jobDTOMapper.getDTOFromEntity(job);
    }

    @Override
    @Transactional(readOnly = true)
    public Job getById(Long id) {
        return jpaRepository.findById(id).orElseThrow(JobNotFoundException::new);
    }

    private void persist(Job job) {
        jpaRepository.save(job);
    }
}
