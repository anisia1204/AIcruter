package com.testinprod.dto;

import com.testinprod.entity.JobStatus;

public class JobStatusChangeDTO {
    private Long id;
    private JobStatus status;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }
}
