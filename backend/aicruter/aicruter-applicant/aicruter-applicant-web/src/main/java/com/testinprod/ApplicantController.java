package com.testinprod;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.testinprod.dto.ApplicantDTO;
import com.testinprod.validator.ApplicantValidator;
import com.testinprod.validator.UserAccountValidator;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/applicant")
@CrossOrigin
public class ApplicantController {
    private final UserAccountValidator userAccountValidator;
    private final ApplicantValidator applicantValidator;
    private final ApplicantService applicantService;

    public ApplicantController(UserAccountValidator userAccountValidator, ApplicantValidator applicantValidator, ApplicantService applicantService) {
        this.userAccountValidator = userAccountValidator;
        this.applicantValidator = applicantValidator;
        this.applicantService = applicantService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestPart("applicantDTO") String applicantDTOString,
                                      @RequestPart("resume") MultipartFile resume,
                                      BindingResult bindingResult) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        ApplicantDTO applicantDTO = objectMapper.readValue(applicantDTOString, ApplicantDTO.class);

        userAccountValidator.validate(applicantDTO.getUserAccountDTO(), bindingResult);
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
        return ResponseEntity.ok(applicantService.register(applicantDTO, resume));
    }
}
