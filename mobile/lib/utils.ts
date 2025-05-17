import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatEnum = (value: string) =>
  value
    .split('_')
    .map((word) => word[0] + word.slice(1).toLowerCase())
    .join(' ');
