export interface ApplicantProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  description?: string;
  education?: string;
  resumeVO?: ResumeVO;
}

export interface ResumeVO {
  id: number;
  name: string;
  size: number;
  content?: Uint8Array;
  base64EncodedStringOfFileContent?: string;
}
