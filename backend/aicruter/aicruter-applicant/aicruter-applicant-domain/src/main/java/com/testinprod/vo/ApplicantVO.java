package com.testinprod.vo;

import com.testinprod.service.AddressDTO;

public class ApplicantVO {
    private Long id;
    private UserAccountVO userAccountVO;
    private ResumeVO resumeVO;
    private AddressDTO addressDTO;
    private String description;
    private String education;

    public ApplicantVO(Long id, UserAccountVO userAccountVO, ResumeVO resumeVO, AddressDTO addressDTO, String description, String education) {
        this.id = id;
        this.userAccountVO = userAccountVO;
        this.resumeVO = resumeVO;
        this.addressDTO = addressDTO;
        this.description = description;
        this.education = education;
    }

    public Long getId() {
        return id;
    }

    public UserAccountVO getUserAccountVO() {
        return userAccountVO;
    }

    public ResumeVO getResumeVO() {
        return resumeVO;
    }

    public AddressDTO getAddressDTO() {
        return addressDTO;
    }

    public String getDescription() {
        return description;
    }

    public String getEducation() {
        return education;
    }
}
