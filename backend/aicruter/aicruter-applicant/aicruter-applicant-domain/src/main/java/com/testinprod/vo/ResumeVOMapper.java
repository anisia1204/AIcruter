package com.testinprod.vo;

import com.testinprod.entity.Resume;
import org.springframework.stereotype.Component;

import java.util.Base64;

@Component
public class ResumeVOMapper {
    public ResumeVO getVOFromEntity(Resume resume) {
        return new ResumeVO(
                resume.getId(),
                resume.getName(),
                resume.getSize(),
                resume.getContent(),
                Base64.getEncoder().encodeToString(resume.getContent())
        );
    }
}
