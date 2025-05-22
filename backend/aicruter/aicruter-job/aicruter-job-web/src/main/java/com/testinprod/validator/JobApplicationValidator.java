package com.testinprod.validator;

import com.testinprod.JobApplicationService;
import com.testinprod.dto.JobApplicationStatusChangeDTO;
import com.testinprod.entity.JobApplication;
import com.testinprod.entity.JobApplicationStatus;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
@Component
public class JobApplicationValidator implements Validator {
    private final JobApplicationService jobApplicationService;

    public JobApplicationValidator(JobApplicationService jobApplicationService) {
        this.jobApplicationService = jobApplicationService;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return JobApplicationStatusChangeDTO.class.equals(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        JobApplicationStatusChangeDTO jobApplicationStatusChangeDTO = (JobApplicationStatusChangeDTO) target;
        JobApplication jobApplication = jobApplicationService.getById(jobApplicationStatusChangeDTO.getId());
        JobApplicationStatus currentStatus = jobApplication.getStatus();
        if(!JobApplicationStatus.getPossibleTransitionsForStatus(currentStatus).contains(jobApplicationStatusChangeDTO.getStatus())) {
            errors.reject("status", "Job Application's status can't go from " + currentStatus + " to " + jobApplicationStatusChangeDTO.getStatus());
        }
    }
}
