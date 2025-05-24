package com.testinprod.impl;

import com.testinprod.CompanyService;
import com.testinprod.dto.CompanyDTO;
import com.testinprod.dto.CompanyDTOMapper;
import com.testinprod.entity.Company;
import com.testinprod.exception.CompanyNotFoundException;
import com.testinprod.repository.CompanyJPARepository;
import com.testinprod.vo.CompanyVO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    @Override
    @Transactional(readOnly = true)
    public CompanyDTO getTemplateById(Long id) {
        return companyDTOMapper.getDTOFromEntity(getById(id));
    }

    @Override
    @Transactional
    public CompanyDTO update(CompanyDTO companyDTO) {
        Company company = getById(companyDTO.getId());
        companyDTOMapper.updateEntityFields(company, companyDTO);
        company = persist(company);
        return companyDTOMapper.getDTOFromEntity(company);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CompanyVO> getAllForDropdown() {
        return companyJPARepository.findAllByOrderByNameAsc()
                .stream()
                .map(company -> new CompanyVO(company.getId(), company.getName()))
                .toList();
    }

    private Company persist(Company company) {
        return companyJPARepository.save(company);
    }
}
