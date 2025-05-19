package com.testinprod;

import com.testinprod.dto.ApplicantDTO;
import com.testinprod.dto.ResumeDTO;
import com.testinprod.entity.Applicant;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ApplicantService {
    ApplicantDTO register(ApplicantDTO applicantDTO, MultipartFile resume) throws IOException;
    Applicant getById(Long id);
    Applicant getByUserAccountId(Long userId);
    ApplicantDTO update(ApplicantDTO applicantDTO);
    ResumeDTO updateResume(MultipartFile file) throws IOException;
    ApplicantDTO getTemplate(Long id);
}
