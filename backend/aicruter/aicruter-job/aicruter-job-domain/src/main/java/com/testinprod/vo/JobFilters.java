package com.testinprod.vo;

import com.testinprod.entity.EmploymentType;
import com.testinprod.entity.JobLocationType;

public class JobFilters {
    private String title;
    private String state;
    private JobLocationType locationType;
    private EmploymentType employmentType;

    public JobFilters(String title, String state, JobLocationType locationType, EmploymentType employmentType) {
        this.title = title;
        this.state = state;
        this.locationType = locationType;
        this.employmentType = employmentType;
    }

    public String getTitle() {
        return title;
    }

    public String getState() {
        return state;
    }

    public JobLocationType getLocationType() {
        return locationType;
    }

    public EmploymentType getEmploymentType() {
        return employmentType;
    }
}
