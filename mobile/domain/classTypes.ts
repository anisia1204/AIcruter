import { Address, AIMatchingType, EmployeeRole, EmploymentType, JobApplicationStatus, JobLocationType, JobStatus, UserRole } from "./VOandEnums";

export type Company = {
    id: number;
    legalAddress: Address;
    displayedName: string;
    picture: string;
};

export type UserAccount = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    picture: string;
    telephone: string;
    userRole: UserRole;
};

export type Employer = {
    id: number;
    userAccount: UserAccount;
    company: Company;
    employeeRole: EmployeeRole;
};

export type Applicant = {
    id: number;
    userAccount: UserAccount;
    address: Address;
    resume: Resume;
    description: string;
    education: string;
};

export type Resume = {
    id: number;
    file_name: string;
    file_size: number;
    content: any; // change these with the correct types when needed
};

export type Job = {
    id: number;
    jobTitle: string;
    jobDescription: string;
    creationDate: Date;
    jobLocationType: JobLocationType;
    employmentType: EmploymentType;
    jobStatus: JobStatus;
};

export type JobApplication = {
    id: number;
    applicant: Applicant;
    job: Job;
    status: JobApplicationStatus;
    createdAt: Date;
};

export type JobNotification = {
    id: number;
    applicant: Applicant;
    job: Job;
    notificationDescription: string;
    notificationTitle: string;
};

export type AIMatching = {
    id: number;
    job: Job;
    applicant: Applicant;
    jobApplication: JobApplication;
    type: AIMatchingType;
    score: number;
};