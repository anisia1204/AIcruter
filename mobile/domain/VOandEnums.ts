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
    postalCode: string;
};

export enum JobApplicationStatus {
    NEW = "NEW",
    IN_REVIEW = "IN_REVIEW",
    INTERVIEW = "INTERVIEW",
    ACCEPTED = "ACCEPTED",
    REJECTED = "REJECTED",
};

export enum JobLocationType {
    ON_SITE = "On site",
    HYBRID = "Hybrid",
    REMOTE = "Remote",
};

export enum EmploymentType {
    PART_TIME = "Part time",
    FULL_TIME = "Full time",
};

export enum JobStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
};

export enum AIMatchingType {
    POTENTIAL_CANDIDATES = "POTENTIAL_CANDIDATES",
    BEST_CANDIDATES = "BEST_CANDIDATES",
    RECOMMENDED_JOBS = "RECOMMENDED_JOBS",
};

