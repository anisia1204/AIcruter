package com.testinprod.impl;

import com.testinprod.CompanyService;
import com.testinprod.EmployerService;
import com.testinprod.JobFilterService;
import com.testinprod.JobService;
import com.testinprod.context.UserContextHolder;
import com.testinprod.dto.JobDTO;
import com.testinprod.dto.JobDTOMapper;
import com.testinprod.dto.JobStatusChangeDTO;
import com.testinprod.entity.Job;
import com.testinprod.entity.JobStatus;
import com.testinprod.exception.JobNotFoundException;
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
import java.util.List;

@Service
public class JobServiceImpl implements JobService {
    private final JobJPARepository jpaRepository;
    private final JobDTOMapper jobDTOMapper;
    private final CompanyService companyService;
    private final EmployerService employerService;
    private final JobFilterService jobFilterService;
    private final JobVOMapper jobVOMapper;

    public JobServiceImpl(JobJPARepository jpaRepository, JobDTOMapper jobDTOMapper, CompanyService companyService, EmployerService employerService, JobFilterService jobFilterService, JobVOMapper jobVOMapper) {
        this.jpaRepository = jpaRepository;
        this.jobDTOMapper = jobDTOMapper;
        this.companyService = companyService;
        this.employerService = employerService;
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
        Specification<Job> specification = jobFilterService.buildDefaultSpecification(jobFilters);
        return jpaRepository.findAll(specification, pageable).map(jobVOMapper::getVOFromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobVO> getAllJobsByCurrentCompany(JobFilters jobFilters, Pageable pageable) {
        Specification<Job> specification = jobFilterService.buildDefaultSpecification(jobFilters);

        Specification<Job> companySpecification = (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("company").get("id"),
                        employerService.getByUserAccountId(UserContextHolder.getUserContext().getUserId()).getCompany().getId());

        specification = specification.and(companySpecification);

        return jpaRepository.findAll(specification, pageable)
                .map(jobVOMapper::getVOFromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobVO> getAllJobsByCompanyId(JobFilters jobFilters, Pageable pageable) {
        Specification<Job> specification = jobFilterService.buildDefaultSpecification(jobFilters);

        Specification<Job> companySpecification = (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("company").get("id"), jobFilters.getCompanyId());

        specification = specification.and(companySpecification);

        return jpaRepository.findAll(specification, pageable)
                .map(jobVOMapper::getVOFromEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public Job getById(Long id) {
        return jpaRepository.findById(id).orElseThrow(JobNotFoundException::new);
    }

    @Override
    @Transactional(readOnly = true)
    public JobVO getTemplateById(Long id) {
        Job job = getById(id);
        return jobVOMapper.getVOFromEntity(job);
    }

    @Override
    @Transactional(readOnly = true)
    public List<String> getAllDistinctStatesAssociatedToJobs() {
        return jpaRepository.findAllDistinctStatesAssociatedToJobs();
    }

    @Override
    @Transactional
    public JobStatus updateStatus(JobStatusChangeDTO jobStatusChangeDTO) {
        Job job = getById(jobStatusChangeDTO.getId());
        job.setStatus(jobStatusChangeDTO.getStatus());
        persist(job);
        return job.getStatus();
    }

    private void persist(Job job) {
        jpaRepository.save(job);
    }
}
