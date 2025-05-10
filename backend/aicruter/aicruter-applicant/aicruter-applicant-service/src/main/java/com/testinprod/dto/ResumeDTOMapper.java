package com.testinprod.dto;

import com.testinprod.entity.Resume;
import org.springframework.stereotype.Component;

@Component
public class ResumeDTOMapper {

    public Resume getEntityFromDTO(ResumeDTO resumeDTO) {
        Resume resume = new Resume();
        resume.setName(resumeDTO.getName());
        resume.setSize(resumeDTO.getSize());
        resume.setContent(resumeDTO.getContent());
        return resume;
    }

    public ResumeDTO getDTOFromEntity(Resume resume) {
        ResumeDTO resumeDTO = new ResumeDTO();
        resumeDTO.setId(resume.getId());
        resumeDTO.setName(resume.getName());
        resumeDTO.setSize(resume.getSize());
        resumeDTO.setContent(resume.getContent());
        return resumeDTO;
    }
}
