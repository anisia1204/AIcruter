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
import com.testinprod.vo.JobApplicationVO;
import com.testinprod.vo.JobApplicationVOMapper;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class JobApplicationServiceImpl implements JobApplicationService {
    private final JobApplicationJPARepository jpaRepository;
    private final JobService jobService;
    private final ApplicantService applicantService;
    private final JobApplicationDTOMapper dtoMapper;
    private final JobApplicationVOMapper voMapper;

    public JobApplicationServiceImpl(JobApplicationJPARepository jpaRepository, JobService jobService, ApplicantService applicantService, JobApplicationDTOMapper dtoMapper, JobApplicationVOMapper voMapper) {
        this.jpaRepository = jpaRepository;
        this.jobService = jobService;
        this.applicantService = applicantService;
        this.dtoMapper = dtoMapper;
        this.voMapper = voMapper;
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

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationVO> getAllJobApplicationsOfCurrentUser(Pageable pageable, String status) {
        Specification<JobApplication> specification = buildDefaultSpecification(status);
        Specification<JobApplication> userSpecification = (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("applicant").get("userAccount").get("id"), UserContextHolder.getUserContext().getUserId());
        specification = specification.and(userSpecification);
        return jpaRepository.findAll(specification, pageable).map(voMapper::getVOFromEntityByCurrentUser);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobApplicationVO> getJobApplicationsByJobId(Pageable pageable, String status, String jobId) {
        Specification<JobApplication> specification = buildDefaultSpecification(status);
        Specification<JobApplication> jobSpecification = (root, query, criteriaBuilder) ->
                criteriaBuilder.equal(root.get("job").get("id"), jobId);
        specification = specification.and(jobSpecification);
        return jpaRepository.findAll(specification, pageable).map(voMapper::getVOFromEntityByJobId);
    }

    private static Specification<JobApplication> buildDefaultSpecification(String status) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private void persist(JobApplication jobApplication) {
        jpaRepository.save(jobApplication);
    }
}
