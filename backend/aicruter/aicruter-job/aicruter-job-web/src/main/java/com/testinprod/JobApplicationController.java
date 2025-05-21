package com.testinprod;

import com.testinprod.dto.JobApplicationDTO;
import com.testinprod.vo.JobApplicationVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/job-application")
public class JobApplicationController {
    private final JobApplicationService jobApplicationService;

    public JobApplicationController(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
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
}
