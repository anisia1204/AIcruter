package com.testinprod.impl;

import com.testinprod.CompanyService;
import com.testinprod.JobFilterService;
import com.testinprod.JobService;
import com.testinprod.dto.JobDTO;
import com.testinprod.dto.JobDTOMapper;
import com.testinprod.entity.Job;
import com.testinprod.entity.JobStatus;
import com.testinprod.repository.JobJPARepository;
import com.testinprod.vo.JobFilters;
import com.testinprod.vo.JobVO;
import com.testinprod.vo.JobVOMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class JobServiceImpl implements JobService {
    private final JobJPARepository jpaRepository;
    private final JobDTOMapper jobDTOMapper;
    private final CompanyService companyService;
    private final JobFilterService jobFilterService;
    private final JobVOMapper jobVOMapper;

    public JobServiceImpl(JobJPARepository jpaRepository, JobDTOMapper jobDTOMapper, CompanyService companyService, JobFilterService jobFilterService, JobVOMapper jobVOMapper) {
        this.jpaRepository = jpaRepository;
        this.jobDTOMapper = jobDTOMapper;
        this.companyService = companyService;
        this.jobFilterService = jobFilterService;
        this.jobVOMapper = jobVOMapper;
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
    public Page<JobVO> getAllJobs(JobFilters jobFilters, Pageable pageable) {
        Specification<Job> specification = jobFilterService.buildSpecification(jobFilters);
        return jpaRepository.findAll(specification, pageable).map(jobVOMapper::getVOFromEntity);
    }

    private void persist(Job job) {
        jpaRepository.save(job);
    }
}
