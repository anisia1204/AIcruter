package com.testinprod.dto;

import com.testinprod.entity.Applicant;
import com.testinprod.service.AddressDTOMapper;
import org.springframework.stereotype.Component;

@Component
public class ApplicantDTOMapper {
    private final UserAccountDTOMapper userAccountDTOMapper;
    private final ResumeDTOMapper resumeDTOMapper;
    private final AddressDTOMapper addressDTOMapper;

    public ApplicantDTOMapper(UserAccountDTOMapper userAccountDTOMapper, ResumeDTOMapper resumeDTOMapper, AddressDTOMapper addressDTOMapper) {
        this.userAccountDTOMapper = userAccountDTOMapper;
        this.resumeDTOMapper = resumeDTOMapper;
        this.addressDTOMapper = addressDTOMapper;
    }

    public Applicant getEntityFromDTO(ApplicantDTO applicantDTO) {
        Applicant applicant = new Applicant();
        applicant.setUserAccount(userAccountDTOMapper.getEntityFromDTO(applicantDTO.getUserAccountDTO()));
        applicant.setResume(resumeDTOMapper.getEntityFromDTO(applicantDTO.getResumeDTO()));
        applicant.setAddress
                (addressDTOMapper.getEntityFromDTO(applicantDTO.getAddressDTO()));
        applicant.setDescription(applicantDTO.getDescription());
        applicant.setEducation(applicantDTO.getEducation());
        return applicant;
    }

    public ApplicantDTO getDTOFromEntity(Applicant applicant) {
        ApplicantDTO applicantDTO = new ApplicantDTO();
        applicantDTO.setId(applicant.getId());
        applicantDTO.setUserAccountDTO(userAccountDTOMapper.getDTOFromEntity(applicant.getUserAccount()));
        applicantDTO.setResumeDTO(resumeDTOMapper.getDTOFromEntity(applicant.getResume()));
        applicant.setAddress(addressDTOMapper.getEntityFromDTO(applicantDTO.getAddressDTO()));
        applicant.setDescription(applicantDTO.getDescription());
        applicant.setEducation(applicantDTO.getEducation());
        return applicantDTO;
    }
}
