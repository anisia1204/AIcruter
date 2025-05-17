package com.testinprod;

import com.testinprod.dto.JobDTO;
import com.testinprod.entity.EmploymentType;
import com.testinprod.entity.JobLocationType;
import com.testinprod.vo.JobFilters;
import com.testinprod.vo.JobVO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job")
public class JobController {
    private final JobService jobService;
    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping
    public ResponseEntity<JobDTO> save(@RequestBody JobDTO jobDTO) {
        return ResponseEntity.ok(jobService.save(jobDTO));
    }

    @GetMapping
    public ResponseEntity<Page<JobVO>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "createdAt") String sortField,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String locationType,
            @RequestParam(required = false) String employmentType

    ) {
        Pageable pageable = PageRequest.of(page, size,
                sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortField).ascending() : Sort.by(sortField).descending());
        return ResponseEntity.ok(jobService.getAllJobs(new JobFilters(title, state, locationType != null ? JobLocationType.valueOf(locationType) : null, employmentType != null ? EmploymentType.valueOf(employmentType) : null), pageable));
    }

    @GetMapping("/states")
    public ResponseEntity<List<String>> getAllStatesAssociatedToJobs() {
        return ResponseEntity.ok(jobService.getAllDistinctStatesAssociatedToJobs());
    }
}
