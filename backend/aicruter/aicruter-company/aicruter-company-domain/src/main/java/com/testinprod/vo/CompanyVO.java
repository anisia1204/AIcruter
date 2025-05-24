package com.testinprod.vo;

import com.testinprod.service.AddressDTO;

public class CompanyVO {
    private Long id;
    private String name;
    private AddressDTO legalAddressDTO;

    public CompanyVO(Long id, String name, AddressDTO legalAddressDTO) {
        this.id = id;
        this.name = name;
        this.legalAddressDTO = legalAddressDTO;
    }

    public CompanyVO(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public AddressDTO getLegalAddressDTO() {
        return legalAddressDTO;
    }
}
