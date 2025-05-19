package com.testinprod.validator;

import com.testinprod.EmployerService;
import com.testinprod.context.UserContextHolder;
import com.testinprod.entity.EmployeeRole;
import com.testinprod.entity.Employer;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;

@Component
public class CompanyValidator  implements Validator {
    private final EmployerService employerService;

    public CompanyValidator(EmployerService employerService) {
        this.employerService = employerService;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return false;
    }

    @Override
    public void validate(Object target, Errors errors) {
        Employer currentEmployer = employerService.getByUserAccountId(UserContextHolder.getUserContext().getUserId());
        if(currentEmployer == null) {
            errors.rejectValue("id", "The employer doesn't exist!");
        }
        if(currentEmployer != null && currentEmployer.getRole() == EmployeeRole.ADMIN) {
            errors.rejectValue("id", "Employers with ADMIN role cannot modify company's details!");
        }
    }
}
