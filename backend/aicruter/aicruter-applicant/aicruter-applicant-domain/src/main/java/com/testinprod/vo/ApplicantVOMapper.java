package com.testinprod.vo;

import com.testinprod.entity.Applicant;
import com.testinprod.service.AddressDTOMapper;
import org.springframework.stereotype.Component;

@Component
public class ApplicantVOMapper {
    private final UserAccountVOMapper userAccountVOMapper;
    private final ResumeVOMapper resumeVOMapper;
    private final AddressDTOMapper addressDTOMapper;

    public ApplicantVOMapper(UserAccountVOMapper userAccountVOMapper, ResumeVOMapper resumeVOMapper, AddressDTOMapper addressDTOMapper) {
        this.userAccountVOMapper = userAccountVOMapper;
        this.resumeVOMapper = resumeVOMapper;
        this.addressDTOMapper = addressDTOMapper;
    }

    public ApplicantVO getVOFromEntity(Applicant applicant) {
        return new ApplicantVO(
                applicant.getId(),
                userAccountVOMapper.getVOFromEntity(applicant.getUserAccount()),
                resumeVOMapper.getVOFromEntity(applicant.getResume()),
                addressDTOMapper.getDTOFromEntity(applicant.getAddress()),
                applicant.getDescription(),
                applicant.getEducation()
        );
    }
}
