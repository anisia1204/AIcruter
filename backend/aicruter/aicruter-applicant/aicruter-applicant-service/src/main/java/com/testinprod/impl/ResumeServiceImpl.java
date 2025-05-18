package com.testinprod.impl;

import com.testinprod.ResumeService;
import com.testinprod.dto.ResumeDTO;
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

    @Override
    @Transactional
    public ResumeDTO update(MultipartFile file, Long currentResumeId) throws IOException {
        Resume resume = getById(currentResumeId);
        dtoMapper.updateEntityFields(resume, file);
        resume = persist(resume);
        return dtoMapper.getDTOFromEntity(resume);
    }

    @Override
    @Transactional(readOnly = true)
    public Resume getById(Long id) {
        return jpaRepository.findById(id).orElseThrow();
    }

    private Resume persist(Resume resume) {
        return jpaRepository.save(resume);
    }
}
