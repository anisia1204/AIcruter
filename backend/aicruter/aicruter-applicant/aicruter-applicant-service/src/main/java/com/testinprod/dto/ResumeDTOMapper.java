package com.testinprod.dto;

import com.testinprod.entity.Resume;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class ResumeDTOMapper {

    public Resume getEntityFromFile(MultipartFile resume) throws IOException {
        Resume entity = new Resume();
        updateEntityFields(entity, resume);
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

    public void updateEntityFields(Resume entity, MultipartFile resume) throws IOException {
        entity.setName(resume.getOriginalFilename());
        entity.setSize(resume.getSize());
        entity.setContent(resume.getBytes());
    }
}
