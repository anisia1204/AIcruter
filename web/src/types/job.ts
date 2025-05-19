/* eslint-disable @typescript-eslint/no-explicit-any */
export interface JobVO {
  id: number;
  companyId: number;
  companyName: string;
  city: string;
  state: string;
  title: string;
  description: string;
  locationType: LOCATION_TYPE;
  employmentType: any;
  status: any;
  createdAt: string;
}

export enum LOCATION_TYPE {
  "ON_SITE" = "On site",
  "HYBRID" = "Hybrid",
  "REMOTE" = "Remote",
}

export enum EMPLOYMENT_TYPE {
  "PART_TIME" = "Part Time",
  "FULL_TIME" = "Full Time",
}
