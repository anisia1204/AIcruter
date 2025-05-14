package com.testinprod.dto;

import com.testinprod.entity.EmploymentType;
import com.testinprod.entity.JobLocationType;
import com.testinprod.entity.JobStatus;

import java.time.LocalDateTime;

public class JobDTO {
    private Long id;
    private Long companyId;
    private String title;
    private String description;
    private JobLocationType locationType;
    private EmploymentType employmentType;
    private JobStatus status;
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public JobLocationType getLocationType() {
        return locationType;
    }

    public void setLocationType(JobLocationType locationType) {
        this.locationType = locationType;
    }

    public EmploymentType getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(EmploymentType employmentType) {
        this.employmentType = employmentType;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
