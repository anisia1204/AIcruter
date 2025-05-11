package com.testinprod;

import com.testinprod.dto.ApplicantDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ApplicantService {
    ApplicantDTO register(ApplicantDTO applicantDTO, MultipartFile resume) throws IOException;
}
