package com.testinprod.dto;

import com.testinprod.entity.Job;
import org.springframework.stereotype.Component;

@Component
public class JobDTOMapper {
    public Job getEntityFromDTO(JobDTO dto) {
        Job entity = new Job();
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setEmploymentType(dto.getEmploymentType());
        entity.setLocationType(dto.getLocationType());
        return entity;
    }

    public JobDTO getDTOFromEntity(Job entity) {
        JobDTO dto = new JobDTO();
        dto.setId(entity.getId());
        dto.setCompanyId(entity.getCompany().getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setEmploymentType(entity.getEmploymentType());
        dto.setLocationType(entity.getLocationType());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setStatus(entity.getStatus());
        return dto;
    }
}
