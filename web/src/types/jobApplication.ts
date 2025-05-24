import { EMPLOYMENT_TYPE, LOCATION_TYPE } from "./job";

export interface JobApplicationVO {
  id: number;
  jobId?: number;
  title?: string;
  employmentType?: EMPLOYMENT_TYPE;
  jobLocationType?: LOCATION_TYPE;
  applicantId?: number;
  applicantDescription?: string;
  applicantEducation?: string;
  applicantFirstName?: string;
  applicantLastName?: string;
  applicantEmail?: string;
  applicantTelephone?: string;
  resumeVO?: ResumeVO;
  companyId?: number;
  createdAt: string;
  status: JOB_APPLICATION_STATUS;
  companyName?: string;
  country?: string;
  city?: string;
  state?: string;
}

export interface ResumeVO {
  id: number;
  name: string;
  size: number;
  content?: Uint8Array;
  base64EncodedStringOfFileContent?: string;
}

export enum JOB_APPLICATION_STATUS {
  "NEW" = "NEW",
  "IN_REVIEW" = "IN_REVIEW",
  "INTERVIEW" = "INTERVIEW",
  "ACCEPTED" = "ACCEPTED",
  "REJECTED" = "REJECTED",
}

export const JOB_APPLICATION_STATUS_LABELS: Record<
  JOB_APPLICATION_STATUS,
  string
> = {
  [JOB_APPLICATION_STATUS.NEW]: "New",
  [JOB_APPLICATION_STATUS.IN_REVIEW]: "In Review",
  [JOB_APPLICATION_STATUS.INTERVIEW]: "Interview",
  [JOB_APPLICATION_STATUS.ACCEPTED]: "Accepted",
  [JOB_APPLICATION_STATUS.REJECTED]: "Rejected",
};

export const JOB_APPLICATION_STATUS_COLORS: Record<
  JOB_APPLICATION_STATUS,
  string
> = {
  [JOB_APPLICATION_STATUS.NEW]: "bg-blue-100 text-blue-800",
  [JOB_APPLICATION_STATUS.IN_REVIEW]: "bg-yellow-100 text-yellow-800",
  [JOB_APPLICATION_STATUS.INTERVIEW]: "bg-purple-100 text-purple-800",
  [JOB_APPLICATION_STATUS.ACCEPTED]: "bg-green-100 text-green-800",
  [JOB_APPLICATION_STATUS.REJECTED]: "bg-red-100 text-red-800",
};

// Status transition rules based on backend logic
export const JOB_APPLICATION_STATUS_TRANSITIONS: Record<
  JOB_APPLICATION_STATUS,
  JOB_APPLICATION_STATUS[]
> = {
  [JOB_APPLICATION_STATUS.NEW]: [
    JOB_APPLICATION_STATUS.IN_REVIEW,
    JOB_APPLICATION_STATUS.INTERVIEW,
    JOB_APPLICATION_STATUS.ACCEPTED,
    JOB_APPLICATION_STATUS.REJECTED,
  ],
  [JOB_APPLICATION_STATUS.IN_REVIEW]: [
    JOB_APPLICATION_STATUS.INTERVIEW,
    JOB_APPLICATION_STATUS.ACCEPTED,
    JOB_APPLICATION_STATUS.REJECTED,
  ],
  [JOB_APPLICATION_STATUS.INTERVIEW]: [
    JOB_APPLICATION_STATUS.ACCEPTED,
    JOB_APPLICATION_STATUS.REJECTED,
  ],
  [JOB_APPLICATION_STATUS.ACCEPTED]: [JOB_APPLICATION_STATUS.REJECTED],
  [JOB_APPLICATION_STATUS.REJECTED]: [],
};

export interface JobApplicationStatusChangeDTO {
  id: number;
  status: JOB_APPLICATION_STATUS;
}
