package com.testinprod.entity;

import java.util.List;

public enum JobApplicationStatus {
    NEW, IN_REVIEW, INTERVIEW, ACCEPTED, REJECTED;

    public static List<JobApplicationStatus> getPossibleTransitionsForStatus(JobApplicationStatus status) {
        return switch (status) {
            case NEW -> List.of(IN_REVIEW, INTERVIEW, ACCEPTED, REJECTED);
            case IN_REVIEW -> List.of(INTERVIEW, ACCEPTED, REJECTED);
            case INTERVIEW -> List.of(ACCEPTED, REJECTED);
            case ACCEPTED -> List.of(REJECTED);
            case REJECTED -> List.of();
        };
    }
}
