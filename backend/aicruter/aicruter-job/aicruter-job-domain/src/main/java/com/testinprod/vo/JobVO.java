package com.testinprod.vo;

import com.testinprod.entity.EmploymentType;
import com.testinprod.entity.JobLocationType;
import com.testinprod.entity.JobStatus;

import java.time.LocalDateTime;

public class JobVO {
    private Long id;
    private Long companyId;
    private String companyName;
    private String state;
    private String title;
    private String description;
    private JobLocationType locationType;
    private EmploymentType employmentType;
    private JobStatus status;
    private LocalDateTime createdAt;

    public JobVO(Long id, Long companyId, String companyName, String state, String title, String description, JobLocationType locationType, EmploymentType employmentType, JobStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.companyId = companyId;
        this.companyName = companyName;
        this.state = state;
        this.title = title;
        this.description = description;
        this.locationType = locationType;
        this.employmentType = employmentType;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getState() {
        return state;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public JobLocationType getLocationType() {
        return locationType;
    }

    public EmploymentType getEmploymentType() {
        return employmentType;
    }

    public JobStatus getStatus() {
        return status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
