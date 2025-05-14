package com.testinprod.dto;

import com.testinprod.entity.JobApplication;
import org.springframework.stereotype.Component;

@Component
public class JobApplicationDTOMapper {
    public JobApplicationDTO getDTOFromEntity(JobApplication entity) {
        JobApplicationDTO dto = new JobApplicationDTO();
        dto.setId(entity.getId());
        dto.setJobId(entity.getJob().getId());
        dto.setApplicantId(entity.getApplicant().getId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setStatus(entity.getStatus());
        return dto;
    }
}
