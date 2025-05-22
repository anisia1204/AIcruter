package com.testinprod;

import com.testinprod.dto.JobApplicationDTO;
import com.testinprod.dto.JobApplicationStatusChangeDTO;
import com.testinprod.validator.JobApplicationValidator;
import com.testinprod.vo.JobApplicationVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/job-application")
public class JobApplicationController {
    private final JobApplicationService jobApplicationService;
    private final JobApplicationValidator jobApplicationValidator;

    public JobApplicationController(JobApplicationService jobApplicationService, JobApplicationValidator jobApplicationValidator) {
        this.jobApplicationService = jobApplicationService;
        this.jobApplicationValidator = jobApplicationValidator;
    }

    @PostMapping
    public ResponseEntity<JobApplicationDTO> save(@RequestBody JobApplicationDTO jobApplicationDTO) {
        return ResponseEntity.ok(jobApplicationService.save(jobApplicationDTO));
    }

    @GetMapping
    public ResponseEntity<Page<JobApplicationVO>> getAllJobApplicationsOfCurrentUser(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "createdAt") String sortField,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(required = false) String status
    ) {
        Pageable pageable = PageRequest.of(page, size,
                sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending());
        return ResponseEntity.ok(jobApplicationService.getAllJobApplicationsOfCurrentUser(pageable, status));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<Page<JobApplicationVO>> getJobApplicationsByJobId(
            @PathVariable String jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "createdAt") String sortField,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(required = false) String status
    ) {
        Pageable pageable = PageRequest.of(page, size,
                sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending());
        return ResponseEntity.ok(jobApplicationService.getJobApplicationsByJobId(pageable, status, jobId));
    }

    @PatchMapping
    public ResponseEntity<?> updateStatus(@RequestBody JobApplicationStatusChangeDTO jobApplicationStatusChangeDTO, BindingResult bindingResult) {
        jobApplicationValidator.validate(jobApplicationStatusChangeDTO, bindingResult);
        if(bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getAllErrors().forEach(error -> {
                String fieldName = ((FieldError) error).getField();
                String errorMessage = error.getCode();
                errors.put(fieldName, errorMessage);
            });
            return ResponseEntity.badRequest().body(errors);
        }
        return ResponseEntity.ok(jobApplicationService.updateStatus(jobApplicationStatusChangeDTO));
    }
}
