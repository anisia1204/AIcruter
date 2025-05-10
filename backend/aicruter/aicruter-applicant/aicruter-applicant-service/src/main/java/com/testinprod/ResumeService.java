package com.testinprod;

import com.testinprod.dto.ResumeDTO;
import com.testinprod.entity.Resume;

public interface ResumeService {
    Resume getById(Long id);
    Resume save(ResumeDTO resumeDTO);
}
