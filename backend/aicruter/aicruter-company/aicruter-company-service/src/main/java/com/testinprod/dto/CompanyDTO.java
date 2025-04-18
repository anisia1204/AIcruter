package com.testinprod.dto;

import com.testinprod.service.AddressDTO;

public class CompanyDTO {
    private Long id;
    private String name;
    private AddressDTO legalAddressDTO;

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
}
