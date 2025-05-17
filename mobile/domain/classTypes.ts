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
    password: string;
    // picture: string;
    phoneNumber: string;
    userRole: UserRole;
};

export type Employer = {
    id: number;
    userAccount: UserAccount;
    company: Company;
    employeeRole: EmployeeRole;
};

export type Applicant = {
    // id: number;
    userAccount: UserAccount;
    address: Address;
    resume: Resume;
    description: string;
    education: string;
};

export type Resume = {
    id: number;
    name: string;
    size: string;
    content: string; // change these with the correct types when needed
};

export type Job = {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    locationType: JobLocationType;
    employmentType: EmploymentType;
    status: JobStatus;
    companyId: string;
    companyName: string;
    state: string;
    city: string;
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