package com.testinprod.dto;

import com.testinprod.entity.Applicant;
import com.testinprod.service.AddressDTOMapper;
import org.springframework.stereotype.Component;

@Component
public class ApplicantDTOMapper {
    private final AddressDTOMapper addressDTOMapper;
    private final UserAccountDTOMapper userAccountDTOMapper;
    private final ResumeDTOMapper resumeDTOMapper;
    public ApplicantDTOMapper(AddressDTOMapper addressDTOMapper, UserAccountDTOMapper userAccountDTOMapper, ResumeDTOMapper resumeDTOMapper) {
        this.addressDTOMapper = addressDTOMapper;
        this.userAccountDTOMapper = userAccountDTOMapper;
        this.resumeDTOMapper = resumeDTOMapper;
    }

    public Applicant getEntityFromDTO(ApplicantDTO applicantDTO) {
        Applicant applicant = new Applicant();
        applicant.setDescription(applicantDTO.getDescription());
        applicant.setEducation(applicantDTO.getEducation());
        applicant.setLegalAddress(addressDTOMapper.getEntityFromDTO(applicantDTO.getLegalAddressDTO()));
        return applicant;
    }

    public ApplicantDTO getDTOFromEntity(Applicant applicant) {
        ApplicantDTO dto = new ApplicantDTO();
        dto.setId(applicant.getId());
        dto.setDescription(applicant.getDescription());
        dto.setEducation(applicant.getEducation());
        dto.setLegalAddressDTO(addressDTOMapper.getDTOFromEntity(applicant.getLegalAddress()));
        dto.setUserAccountDTO(userAccountDTOMapper.getDTOFromEntity(applicant.getUserAccount()));
        dto.setResumeDTO(resumeDTOMapper.getDTOFromEntity(applicant.getResume()));
        return dto;
    }
}
