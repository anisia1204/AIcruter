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

@Service
public class ApplicantServiceImpl implements ApplicantService {

    private final ApplicantJPARepository applicantJPARepository;
    private final UserAccountService userAccountService;
    private final ApplicantDTOMapper applicantDTOMapper;
    private final ConfirmationTokenService confirmationTokenService;
    private final ResumeService resumeService;

    public ApplicantServiceImpl(ApplicantJPARepository applicantJPARepository, UserAccountService userAccountService, ApplicantDTOMapper applicantDTOMapper, ConfirmationTokenService confirmationTokenService, ResumeService resumeService) {
        this.applicantJPARepository = applicantJPARepository;
        this.userAccountService = userAccountService;
        this.applicantDTOMapper = applicantDTOMapper;
        this.confirmationTokenService = confirmationTokenService;
        this.resumeService = resumeService;
    }

    @Override
    public Applicant getById(Long id) {
        return applicantJPARepository.findById(id).orElseThrow(ApplicantNotFoundException::new);
    }

    @Override
    @Transactional
    public ApplicantDTO register(ApplicantDTO applicantDTO)
    {
        UserAccount userAccount = userAccountService.save(applicantDTO.getUserAccountDTO());
        Applicant applicant = save(applicantDTO, userAccount);
        confirmationTokenService.generateTokenAndSendEmailConfirmationToUser(userAccount);
        return applicantDTOMapper.getDTOFromEntity(applicant);
    }

    public Applicant save(ApplicantDTO applicantDTO, UserAccount userAccount) {
        Applicant applicant = new Applicant();
        applicant.setUserAccount(userAccount);

        Resume resume = resumeService.save(applicantDTO.getResumeDTO());
        applicant.setResume(resume);

        return persist(applicant);
    }

    private Applicant persist(Applicant applicant) {
        return applicantJPARepository.save(applicant);
    }

}
