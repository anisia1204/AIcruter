package com.testinprod;

import com.testinprod.dto.EmployerDTO;
import com.testinprod.validator.EmployerValidator;
import com.testinprod.validator.UserAccountValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/employer")
@CrossOrigin
public class EmployerController {

    private final EmployerService employerService;
    private final UserAccountValidator userAccountValidator;
    private final EmployerValidator employerValidator;

    public EmployerController(EmployerService employerService, UserAccountValidator userAccountValidator, EmployerValidator employerValidator) {
        this.employerService = employerService;
        this.userAccountValidator = userAccountValidator;
        this.employerValidator = employerValidator;
    }

    @PostMapping
    public ResponseEntity<?> register(@RequestBody EmployerDTO employerDTO, BindingResult bindingResult) {
        userAccountValidator.validate(employerDTO.getUserAccountDTO(), bindingResult);
        employerValidator.validate(employerDTO, bindingResult);
        if(bindingResult.hasErrors()) {
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
        return ResponseEntity.ok(employerService.register(employerDTO));
    }
}
