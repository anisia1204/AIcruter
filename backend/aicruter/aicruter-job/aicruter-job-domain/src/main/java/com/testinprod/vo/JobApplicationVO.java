package com.testinprod.vo;

import com.testinprod.entity.EmploymentType;
import com.testinprod.entity.JobApplicationStatus;
import com.testinprod.entity.JobLocationType;

import java.time.LocalDateTime;

public class JobApplicationVO {
    private Long id;
    private Long jobId;
    private String title;
    private EmploymentType employmentType;
    private JobLocationType jobLocationType;
    private Long applicantId;
    private Long companyId;
    private LocalDateTime createdAt;
    private JobApplicationStatus status;
    private String companyName;
    private String country;
    private String city;
    private String state;

    public JobApplicationVO(Long id, Long jobId, String title, EmploymentType employmentType, JobLocationType jobLocationType, Long applicantId, Long companyId, LocalDateTime createdAt, JobApplicationStatus status, String companyName, String country, String city, String state) {
        this.id = id;
        this.jobId = jobId;
        this.title = title;
        this.employmentType = employmentType;
        this.jobLocationType = jobLocationType;
        this.applicantId = applicantId;
        this.companyId = companyId;
        this.createdAt = createdAt;
        this.status = status;
        this.companyName = companyName;
        this.country = country;
        this.city = city;
        this.state = state;
    }

    public Long getId() {
        return id;
    }

    public Long getJobId() {
        return jobId;
    }

    public Long getApplicantId() {
        return applicantId;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public JobApplicationStatus getStatus() {
        return status;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getCountry() {
        return country;
    }

    public String getCity() {
        return city;
    }

    public String getState() {
        return state;
    }

    public String getTitle() {
        return title;
    }

    public EmploymentType getEmploymentType() {
        return employmentType;
    }

    public JobLocationType getJobLocationType() {
        return jobLocationType;
    }
}
