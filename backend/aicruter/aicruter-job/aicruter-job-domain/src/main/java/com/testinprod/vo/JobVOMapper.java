package com.testinprod.vo;

import com.testinprod.entity.Job;
import org.springframework.stereotype.Component;

@Component
public class JobVOMapper {
    public JobVO getVOFromEntity(Job job) {
        return new JobVO(
                job.getId(),
                job.getCompany().getId(),
                job.getCompany().getName(),
                job.getCompany().getLegalAddress().getState(),
                job.getTitle(),
                job.getDescription(),
                job.getLocationType(),
                job.getEmploymentType(),
                job.getStatus(),
                job.getCreatedAt()
        );
    }
}
