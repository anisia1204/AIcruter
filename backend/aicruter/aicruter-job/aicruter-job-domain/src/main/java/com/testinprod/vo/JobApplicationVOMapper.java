package com.testinprod.vo;

import com.testinprod.entity.JobApplication;
import org.springframework.stereotype.Component;

@Component
public class JobApplicationVOMapper {
    private final ResumeVOMapper resumeVOMapper;

    public JobApplicationVOMapper(ResumeVOMapper resumeVOMapper) {
        this.resumeVOMapper = resumeVOMapper;
    }

    public JobApplicationVO getVOFromEntityByCurrentUser(JobApplication jobApplication) {
        return new JobApplicationVO(
                jobApplication.getId(),
                jobApplication.getJob().getId(),
                jobApplication.getJob().getTitle(),
                jobApplication.getJob().getEmploymentType(),
                jobApplication.getJob().getLocationType(),
                jobApplication.getApplicant().getId(),
                jobApplication.getJob().getCompany().getId(),
                jobApplication.getCreatedAt(),
                jobApplication.getStatus(),
                jobApplication.getJob().getCompany().getName(),
                jobApplication.getJob().getCompany().getLegalAddress().getCountry(),
                jobApplication.getJob().getCompany().getLegalAddress().getCity(),
                jobApplication.getJob().getCompany().getLegalAddress().getState()
        );
    }
    public JobApplicationVO getVOFromEntityByJobId(JobApplication jobApplication) {
        return new JobApplicationVO(
                jobApplication.getId(),
                jobApplication.getApplicant().getId(),
                jobApplication.getApplicant().getDescription(),
                jobApplication.getApplicant().getEducation(),
                jobApplication.getApplicant().getUserAccount().getFirstName(),
                jobApplication.getApplicant().getUserAccount().getLastName(),
                jobApplication.getApplicant().getUserAccount().getEmail(),
                jobApplication.getApplicant().getUserAccount().getTelephone(),
                resumeVOMapper.getVOFromEntity(jobApplication.getApplicant().getResume()),
                jobApplication.getCreatedAt(),
                jobApplication.getStatus()
        );
    }
}
