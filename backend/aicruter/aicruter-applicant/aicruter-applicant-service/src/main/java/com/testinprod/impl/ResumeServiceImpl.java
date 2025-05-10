package com.testinprod.impl;

import com.testinprod.ResumeService;
import com.testinprod.dto.ResumeDTO;
import com.testinprod.dto.ResumeDTOMapper;
import com.testinprod.entity.Resume;
import com.testinprod.exception.ResumeNotFoundException;
import com.testinprod.repository.ResumeJPARepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

@Service
public class ResumeServiceImpl implements ResumeService {
    private final ResumeJPARepository resumeJPARepository;
    private final ResumeDTOMapper resumeDTOMapper;

    public ResumeServiceImpl(ResumeJPARepository resumeJPARepository, ResumeDTOMapper resumeDTOMapper) {
        this.resumeJPARepository = resumeJPARepository;
        this.resumeDTOMapper = resumeDTOMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Resume getById(Long id) {
        return resumeJPARepository.findById(id).orElseThrow(ResumeNotFoundException::new);
    }

    @Override
    @Transactional
    public Resume save(ResumeDTO resumeDTO) {
        Resume resume = resumeDTOMapper.getEntityFromDTO(resumeDTO);
        return persist(resume);
    }

    private Resume persist(Resume resume) {
        return resumeJPARepository.save(resume);
    }
}
