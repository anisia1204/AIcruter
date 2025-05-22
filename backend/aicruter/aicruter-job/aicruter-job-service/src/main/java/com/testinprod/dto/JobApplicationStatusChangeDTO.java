package com.testinprod.dto;

import com.testinprod.entity.JobApplicationStatus;

public class JobApplicationStatusChangeDTO {
    private Long id;
    private JobApplicationStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JobApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(JobApplicationStatus status) {
        this.status = status;
    }
}
