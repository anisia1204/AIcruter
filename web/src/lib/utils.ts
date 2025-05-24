import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const LOCATION_TYPE_COLORS: Record<string, string> = {
  ON_SITE: "bg-yellow-100 text-yellow-800",
  HYBRID: "bg-purple-100 text-purple-800",
  REMOTE: "bg-green-100 text-green-800",
};

export const EMPLOYMENT_TYPE_COLORS: Record<string, string> = {
  FULL_TIME: "bg-blue-100 text-blue-800",
  PART_TIME: "bg-pink-100 text-pink-800",
};

export const JOB_STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  CLOSED: "Closed",
};

export const JOB_STATUS_COLORS: Record<string, string> = {
  OPEN: "bg-green-100 text-green-600",
  CLOSED: "bg-red-100 text-red-800",
};
