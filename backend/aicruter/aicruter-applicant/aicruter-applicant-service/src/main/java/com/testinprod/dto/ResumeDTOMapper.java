package com.testinprod.dto;

import com.testinprod.entity.Resume;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class ResumeDTOMapper {

    public Resume getEntityFromFile(MultipartFile resume) throws IOException {
        Resume entity = new Resume();
        entity.setName(resume.getOriginalFilename());
        entity.setSize(resume.getSize());
        entity.setContent(resume.getBytes());
        return entity;
    }

    public ResumeDTO getDTOFromEntity(Resume resume) {
        ResumeDTO dto = new ResumeDTO();
        dto.setId(resume.getId());
        dto.setName(resume.getName());
        dto.setSize(resume.getSize());
        dto.setContent(resume.getContent());
        return dto;
    }
}
