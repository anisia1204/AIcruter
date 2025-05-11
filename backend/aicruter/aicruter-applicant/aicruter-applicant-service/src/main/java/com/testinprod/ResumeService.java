package com.testinprod;

import com.testinprod.entity.Resume;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ResumeService {
    Resume save(MultipartFile resume) throws IOException;
}
