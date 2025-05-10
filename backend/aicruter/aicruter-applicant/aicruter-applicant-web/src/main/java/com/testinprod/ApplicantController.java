package com.testinprod;

import com.testinprod.dto.ApplicantDTO;
import com.testinprod.entity.Applicant;
import com.testinprod.validator.ApplicantValidator;
import com.testinprod.validator.ResumeValidator;
import com.testinprod.validator.UserAccountValidator;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/applicant")
@CrossOrigin
public class ApplicantController {

    private final ApplicantService applicantService;
    private final UserAccountValidator userAccountValidator;
    private final ResumeValidator resumeValidator;
    private final ApplicantValidator applicantValidator;

    public ApplicantController(ApplicantService applicantService, UserAccountValidator userAccountValidator, ResumeValidator resumeValidator, ApplicantValidator applicantValidator) {
        this.applicantService = applicantService;
        this.userAccountValidator = userAccountValidator;
        this.resumeValidator = resumeValidator;
        this.applicantValidator = applicantValidator;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody ApplicantDTO applicantDTO, BindingResult bindingResult) {
        userAccountValidator.validate(applicantDTO.getUserAccountDTO(), bindingResult);
        resumeValidator.validate(applicantDTO.getResumeDTO(), bindingResult);
        applicantValidator.validate(applicantDTO, bindingResult);
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
        return new ResponseEntity<>(applicantService.register(applicantDTO), HttpStatus.CREATED);
    }
}
