import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get match color classes based on match percentage
 */
export function getMatchColor(matchPct: number): string {
  if (matchPct >= 80) return 'text-green-600 bg-green-100';
  if (matchPct >= 60) return 'text-blue-600 bg-blue-100';
  if (matchPct >= 40) return 'text-yellow-600 bg-yellow-100';
  return 'text-red-600 bg-red-100';
}
