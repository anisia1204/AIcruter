package com.testinprod;

import com.testinprod.dto.CompanyDTO;
import com.testinprod.validator.CompanyValidator;
import com.testinprod.vo.CompanyFilters;
import com.testinprod.vo.CompanyVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
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

    @GetMapping("/profile/{companyId}")
    @ResponseBody
    public ResponseEntity<?> getProfileInformation(@PathVariable Long companyId) {
        return ResponseEntity.ok(companyService.getProfileInformation(companyId));
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

    @GetMapping("/dropdown")
    public ResponseEntity<List<CompanyVO>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllForDropdown());
    }

    @GetMapping("/all")
    public ResponseEntity<Page<CompanyVO>> getAllCompanies(@RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "10") int size,
                                                          @RequestParam(required = false, defaultValue = "name") String sortField,
                                                          @RequestParam(required = false, defaultValue = "asc") String sortOrder,
                                                          @RequestParam(required = false) String name,
                                                          @RequestParam(required = false) String state,
                                                          @RequestParam(required = false) String city) {

        Pageable pageable = PageRequest.of(page, size,
                sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending());
        return ResponseEntity.ok(companyService.getAll(new CompanyFilters(name, state, city), pageable));
    }
}
