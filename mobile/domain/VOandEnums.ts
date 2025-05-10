export enum UserRole {
    EMPLOYER = "EMPLOYER",
    APPLICANT = "APPLICANT",
};

export enum EmployeeRole {
    OWNER = "OWNER",
    ADMIN = "ADMIN",
};

export type Address = {
    country: string;
    state: string;
    city: string;
    addressLine: string;
    zipCode: string;
};

export enum JobApplicationStatus {
    NEW = "NEW",
    IN_REVIEW = "IN_REVIEW",
    INTERVIEW = "INTERVIEW",
    ACCEPTED = "ACCEPTED",
    PASSED = "PASSED",
};

export enum JobLocationType {
    ON_SITE = "ON_SITE",
    HYBRID = "HYBRID",
    REMOTE = "REMOTE",
};

export enum EmploymentType {
    PART_TIME = "PART_TIME",
    FULL_TIME = "FULL_TIME",
};

export enum JobStatus {
    CAN_STILL_APPLY = "CAN_STILL_APPLY",
    CLOSED = "CLOSED",
};

export enum AIMatchingType {
    POTENTIAL_CANDIDATES = "POTENTIAL_CANDIDATES",
    BEST_CANDITATES = "BEST_CANDIDATES",
    RECOMMENDED_JOBS = "RECOMMENDED_JOBS",
};
