package com.testinprod.vo;

import com.testinprod.entity.Employer;
import org.springframework.stereotype.Component;

@Component
public class EmployerVOMapper {
    public EmployerVO getVOFromEntity(Employer employer) {
        return new EmployerVO(
                employer.getId(),
                employer.getRole(),
                employer.getUserAccount().getFirstName(),
                employer.getUserAccount().getLastName(),
                employer.getUserAccount().getEmail(),
                employer.getUserAccount().getTelephone()
        );
    }
}
