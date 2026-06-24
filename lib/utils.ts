import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getISTDateString(date = new Date()): string {
  // Convert UTC time to IST (UTC + 5.5 hours)
  const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 3600000;
  const istDate = new Date(utcTime + istOffset);
  
  const yyyy = istDate.getFullYear();
  const mm = String(istDate.getMonth() + 1).padStart(2, '0');
  const dd = String(istDate.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

