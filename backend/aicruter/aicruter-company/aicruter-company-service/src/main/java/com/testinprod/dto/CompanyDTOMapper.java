package com.testinprod.dto;

import com.testinprod.entity.Company;
import com.testinprod.service.AddressDTOMapper;
import org.springframework.stereotype.Component;

@Component
public class CompanyDTOMapper {
    private final AddressDTOMapper addressDTOMapper;

    public CompanyDTOMapper(AddressDTOMapper addressDTOMapper) {
        this.addressDTOMapper = addressDTOMapper;
    }

    public Company getEntityFromDTO(CompanyDTO companyDTO) {
        Company company = new Company();
        updateEntityFields(company, companyDTO);
        return company;
    }

    public CompanyDTO getDTOFromEntity(Company company) {
        CompanyDTO companyDTO = new CompanyDTO();
        companyDTO.setId(company.getId());
        companyDTO.setName(company.getName());
        companyDTO.setLegalAddressDTO(addressDTOMapper.getDTOFromEntity(company.getLegalAddress()));
        return companyDTO;
    }

    public void updateEntityFields(Company company, CompanyDTO companyDTO) {
        company.setName(companyDTO.getName());
        company.setLegalAddress(addressDTOMapper.getEntityFromDTO(companyDTO.getLegalAddressDTO()));
    }
}
