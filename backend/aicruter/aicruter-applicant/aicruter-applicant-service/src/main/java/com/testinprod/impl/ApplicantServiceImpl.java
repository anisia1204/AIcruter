package com.testinprod.impl;

import com.testinprod.ApplicantService;
import com.testinprod.ConfirmationTokenService;
import com.testinprod.ResumeService;
import com.testinprod.UserAccountService;
import com.testinprod.dto.ApplicantDTO;
import com.testinprod.dto.ApplicantDTOMapper;
import com.testinprod.entity.Applicant;
import com.testinprod.entity.Resume;
import com.testinprod.entity.UserAccount;
import com.testinprod.exception.ApplicantNotFoundException;
import com.testinprod.repository.ApplicantJPARepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ApplicantServiceImpl implements ApplicantService {
    private final ApplicantJPARepository jpaRepository;
    private final UserAccountService userAccountService;
    private final ConfirmationTokenService confirmationTokenService;
    private final ApplicantDTOMapper applicantDTOMapper;
    private final ResumeService resumeService;

    public ApplicantServiceImpl(ApplicantJPARepository jpaRepository, UserAccountService userAccountService, ConfirmationTokenService confirmationTokenService, ApplicantDTOMapper applicantDTOMapper, ResumeService resumeService) {
        this.jpaRepository = jpaRepository;
        this.userAccountService = userAccountService;
        this.confirmationTokenService = confirmationTokenService;
        this.applicantDTOMapper = applicantDTOMapper;
        this.resumeService = resumeService;
    }

    @Override
    public Applicant getById(Long id) {
        return jpaRepository.findById(id).orElseThrow(ApplicantNotFoundException::new);
    }

    @Override
    @Transactional
    public ApplicantDTO register(ApplicantDTO applicantDTO, MultipartFile file) throws IOException {
        Resume resume = resumeService.save(file);
        UserAccount userAccount = userAccountService.save(applicantDTO.getUserAccountDTO());
        Applicant applicant = save(applicantDTO, userAccount, resume);
        confirmationTokenService.generateTokenAndSendEmailConfirmationToUser(userAccount);
        return applicantDTOMapper.getDTOFromEntity(applicant);
    }

    @Transactional
    public Applicant save(ApplicantDTO applicantDTO, UserAccount userAccount, Resume resume) {
        Applicant applicant = applicantDTOMapper.getEntityFromDTO(applicantDTO);
        applicant.setUserAccount(userAccount);
        applicant.setResume(resume);
        return persist(applicant);
    }

    private Applicant persist(Applicant applicant) {
        return jpaRepository.save(applicant);
    }

}
