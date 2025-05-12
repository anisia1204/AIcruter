package com.testinprod.impl;

import com.testinprod.ResumeService;
import com.testinprod.dto.ResumeDTOMapper;
import com.testinprod.entity.Resume;
import com.testinprod.repository.ResumeJPARepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ResumeServiceImpl implements ResumeService {
    private final ResumeJPARepository jpaRepository;
    private final ResumeDTOMapper dtoMapper;

    public ResumeServiceImpl(ResumeJPARepository jpaRepository, ResumeDTOMapper dtoMapper) {
        this.jpaRepository = jpaRepository;
        this.dtoMapper = dtoMapper;
    }

    @Override
    @Transactional
    public Resume save(MultipartFile resume) throws IOException {
        Resume entity = dtoMapper.getEntityFromFile(resume);
        return persist(entity);
    }

    private Resume persist(Resume resume) {
        return jpaRepository.save(resume);
    }
}
