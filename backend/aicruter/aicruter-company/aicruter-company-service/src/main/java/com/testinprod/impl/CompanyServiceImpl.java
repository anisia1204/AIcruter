package com.testinprod.impl;

import com.testinprod.CompanyService;
import com.testinprod.dto.CompanyDTO;
import com.testinprod.dto.CompanyDTOMapper;
import com.testinprod.entity.Company;
import com.testinprod.exception.CompanyNotFoundException;
import com.testinprod.repository.CompanyJPARepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CompanyServiceImpl implements CompanyService {
    private final CompanyJPARepository companyJPARepository;
    private final CompanyDTOMapper companyDTOMapper;
    public CompanyServiceImpl(CompanyJPARepository companyJPARepository, CompanyDTOMapper companyDTOMapper) {
        this.companyJPARepository = companyJPARepository;
        this.companyDTOMapper = companyDTOMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public Company getById(Long id) {
        return companyJPARepository.findById(id).orElseThrow(CompanyNotFoundException::new);
    }

    @Override
    @Transactional
    public Company save(CompanyDTO companyDTO) {
        Company company = companyDTOMapper.getEntityFromDTO(companyDTO);
        return persist(company);
    }

    private Company persist(Company company) {
        return companyJPARepository.save(company);
    }
}
