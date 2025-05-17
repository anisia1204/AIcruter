package com.testinprod.vo;

import com.testinprod.entity.JobApplication;
import org.springframework.stereotype.Component;

@Component
public class JobApplicationVOMapper {
    public JobApplicationVO getVOFromEntity(JobApplication jobApplication) {
        return new JobApplicationVO(
                jobApplication.getId(),
                jobApplication.getJob().getId(),
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
}
