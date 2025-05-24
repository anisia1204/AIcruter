package com.testinprod.dto;

import com.testinprod.entity.Company;
import com.testinprod.service.AddressDTOMapper;
import com.testinprod.vo.EmployerVOMapper;
import org.springframework.stereotype.Component;

@Component
public class CompanyDTOMapper {
    private final AddressDTOMapper addressDTOMapper;
    private final EmployerVOMapper employerVOMapper;

    public CompanyDTOMapper(AddressDTOMapper addressDTOMapper, EmployerVOMapper employerVOMapper) {
        this.addressDTOMapper = addressDTOMapper;
        this.employerVOMapper = employerVOMapper;
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
        companyDTO.setEmployerVOs(company.getEmployees().stream().map(employerVOMapper::getVOFromEntity).toList());
        return companyDTO;
    }

    public void updateEntityFields(Company company, CompanyDTO companyDTO) {
        company.setName(companyDTO.getName());
        company.setLegalAddress(addressDTOMapper.getEntityFromDTO(companyDTO.getLegalAddressDTO()));
    }
}
