package com.testinprod;

import com.testinprod.dto.CompanyDTO;
import com.testinprod.validator.CompanyValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/company")
public class CompanyController {
    private final CompanyService companyService;
    private final EmployerService employerService;
    private final CompanyValidator companyValidator;

    public CompanyController(CompanyService companyService, EmployerService employerService, CompanyValidator companyValidator) {
        this.companyService = companyService;
        this.employerService = employerService;
        this.companyValidator = companyValidator;
    }

    @GetMapping("/{userAccountId}")
    @ResponseBody
    public ResponseEntity<?> getTemplate(@PathVariable Long userAccountId) {
        return ResponseEntity.ok(employerService.getCompanyTemplateByUserAccountId(userAccountId));
    }

    @PutMapping
    public ResponseEntity<?> update(@RequestBody CompanyDTO companyDTO, BindingResult bindingResult){
        companyValidator.validate(companyDTO, bindingResult);
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getAllErrors().forEach(error -> {
                if (error instanceof FieldError) {
                    String fieldName = ((FieldError) error).getField();
                    String errorMessage = error.getDefaultMessage();
                    errors.put(fieldName, errorMessage);
                } else {
                    errors.put("globalError", error.getDefaultMessage());
                }
            });
            return ResponseEntity.badRequest().body(errors);
        }
        return ResponseEntity.ok(companyService.update(companyDTO));
    }
}
