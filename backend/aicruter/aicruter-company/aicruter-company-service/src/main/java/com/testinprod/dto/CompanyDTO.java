package com.testinprod.dto;

import com.testinprod.service.AddressDTO;
import com.testinprod.vo.EmployerVO;

import java.util.*;
public class CompanyDTO {
    private Long id;
    private String name;
    private AddressDTO legalAddressDTO;
    private List<EmployerVO> employerVOs;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public AddressDTO getLegalAddressDTO() {
        return legalAddressDTO;
    }

    public void setLegalAddressDTO(AddressDTO legalAddressDTO) {
        this.legalAddressDTO = legalAddressDTO;
    }

    public List<EmployerVO> getEmployerVOs() {
        return employerVOs;
    }

    public void setEmployerVOs(List<EmployerVO> employerVOs) {
        this.employerVOs = employerVOs;
    }
}
