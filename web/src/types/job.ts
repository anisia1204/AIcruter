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
  employmentType: EMPLOYMENT_TYPE;
  status: any;
  createdAt: string;
}

export enum LOCATION_TYPE {
  "ON_SITE" = "ON_SITE",
  "HYBRID" = "HYBRID",
  "REMOTE" = "REMOTE",
}

export enum EMPLOYMENT_TYPE {
  "PART_TIME" = "PART_TIME",
  "FULL_TIME" = "FULL_TIME",
}

export const LOCATION_TYPE_LABELS: Record<LOCATION_TYPE, string> = {
  [LOCATION_TYPE.ON_SITE]: "On site",
  [LOCATION_TYPE.HYBRID]: "Hybrid",
  [LOCATION_TYPE.REMOTE]: "Remote",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EMPLOYMENT_TYPE, string> = {
  [EMPLOYMENT_TYPE.PART_TIME]: "Part Time",
  [EMPLOYMENT_TYPE.FULL_TIME]: "Full Time",
};
