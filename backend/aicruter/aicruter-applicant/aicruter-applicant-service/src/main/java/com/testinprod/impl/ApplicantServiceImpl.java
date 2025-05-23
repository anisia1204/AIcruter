package com.testinprod.impl;

import com.testinprod.ApplicantService;
import com.testinprod.ConfirmationTokenService;
import com.testinprod.ResumeService;
import com.testinprod.UserAccountService;
import com.testinprod.context.UserContextHolder;
import com.testinprod.dto.ApplicantDTO;
import com.testinprod.dto.ApplicantDTOMapper;
import com.testinprod.dto.ResumeDTO;
import com.testinprod.entity.Applicant;
import com.testinprod.entity.Resume;
import com.testinprod.entity.UserAccount;
import com.testinprod.exception.ApplicantNotFoundException;
import com.testinprod.repository.ApplicantJPARepository;
import com.testinprod.vo.ApplicantVO;
import com.testinprod.vo.ApplicantVOMapper;
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
    private final ApplicantVOMapper applicantVOMapper;

    public ApplicantServiceImpl(ApplicantJPARepository jpaRepository, UserAccountService userAccountService, ConfirmationTokenService confirmationTokenService, ApplicantDTOMapper applicantDTOMapper, ResumeService resumeService, ApplicantVOMapper applicantVOMapper) {
        this.jpaRepository = jpaRepository;
        this.userAccountService = userAccountService;
        this.confirmationTokenService = confirmationTokenService;
        this.applicantDTOMapper = applicantDTOMapper;
        this.resumeService = resumeService;
        this.applicantVOMapper = applicantVOMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Applicant getById(Long id) {
        return jpaRepository.findById(id).orElseThrow(ApplicantNotFoundException::new);
    }

    @Override
    @Transactional(readOnly = true)
    public Applicant getByUserAccountId(Long userId) {
        return jpaRepository.findByUserAccountId(userId);
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

    @Override
    @Transactional
    public ApplicantDTO update(ApplicantDTO applicantDTO) {
        Applicant applicant = getById(applicantDTO.getId());
        userAccountService.update(applicantDTO.getUserAccountDTO());
        applicantDTOMapper.updateEntityFields(applicant, applicantDTO);
        applicant = persist(applicant);
        return applicantDTOMapper.getDTOFromEntity(applicant);
    }

    @Override
    @Transactional
    public ResumeDTO updateResume(MultipartFile file) throws IOException {
        Applicant applicant = getByUserAccountId(UserContextHolder.getUserContext().getUserId());
        return resumeService.update(file, applicant.getResume().getId());
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicantDTO getTemplateByUserAccountId(Long userAccountId) {
        return applicantDTOMapper.getDTOFromEntity(getByUserAccountId(userAccountId));
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicantVO getProfileInformation(Long applicantId) {
        Applicant applicant = getById(applicantId);
        return applicantVOMapper.getVOFromEntity(applicant);
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
