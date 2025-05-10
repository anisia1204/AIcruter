package com.testinprod;

import com.testinprod.dto.ApplicantDTO;
import com.testinprod.entity.Applicant;

public interface ApplicantService {
    Applicant getById(Long id);
    ApplicantDTO register(ApplicantDTO employerDTO);
}
