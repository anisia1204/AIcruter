package com.testinprod.dto;

import com.testinprod.service.AddressDTO;

public class ApplicantDTO {
    private Long id;
    private UserAccountDTO userAccountDTO;
    private ResumeDTO resumeDTO;
    private AddressDTO legalAddressDTO;
    private String description;
    private String education;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserAccountDTO getUserAccountDTO() {
        return userAccountDTO;
    }

    public void setUserAccountDTO(UserAccountDTO userAccountDTO) {
        this.userAccountDTO = userAccountDTO;
    }

    public ResumeDTO getResumeDTO() {
        return resumeDTO;
    }

    public void setResumeDTO(ResumeDTO resumeDTO) {
        this.resumeDTO = resumeDTO;
    }

    public AddressDTO getLegalAddressDTO() {
        return legalAddressDTO;
    }

    public void setLegalAddressDTO(AddressDTO legalAddressDTO) {
        this.legalAddressDTO = legalAddressDTO;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }
}
