import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string) {
  const names = name.split(" ");
  const initials = names.map(n => n[0]).join("");
  return initials.toUpperCase();
}

export function formatDate(timestamp: string | number | Date, format: string, locale = 'pt-BR'): string {

  const normalizedLocale: string = locale.replace('_', '-');

  const data = new Date(
    typeof timestamp === 'number' && timestamp < 1e12
      ? timestamp * 1000
      : timestamp
  );

  const pad = (n: number): string => ('0' + n).slice(-2);

  const tokens = {
    d: pad(data.getDate()),
    m: pad(data.getMonth() + 1),
    Y: data.getFullYear(),
    y: String(data.getFullYear()).slice(-2),
    H: pad(data.getHours()),
    i: pad(data.getMinutes()),
    s: pad(data.getSeconds()),
    D: new Intl.DateTimeFormat(normalizedLocale, { weekday: 'long' }).format(data),
    M: new Intl.DateTimeFormat(normalizedLocale, { month: 'long' }).format(data),
    dD: new Intl.DateTimeFormat(normalizedLocale, { weekday: 'short' }).format(data),
    dM: new Intl.DateTimeFormat(normalizedLocale, { month: 'short' }).format(data),
  };

  return format.replace(/\b(D|dD|M|dM|d|m|Y|y|H|i|s)\b/g, (token) => tokens[token] ?? token);
}

export function getRelativeTime(
  timestamp: string | number | Date,
  locale: string = 'en'
): string {
  const normalizedLocale: string = locale.replace('_', '-');

  const date: Date =
    timestamp instanceof Date
      ? timestamp
      : new Date(typeof timestamp === 'number' && timestamp < 1e12 ? timestamp * 1000 : timestamp);

  const now: Date = new Date();
  const diffInSeconds: number = Math.floor((date.getTime() - now.getTime()) / 1000);
  const absSeconds: number = Math.abs(diffInSeconds);

  const rtf = new Intl.RelativeTimeFormat(normalizedLocale, { numeric: 'auto' });

  if (absSeconds < 60) return rtf.format(diffInSeconds, 'second');

  const diffInMinutes: number = Math.round(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) return rtf.format(diffInMinutes, 'minute');

  const diffInHours: number = Math.round(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) return rtf.format(diffInHours, 'hour');

  const diffInDays: number = Math.round(diffInHours / 24);
  if (Math.abs(diffInDays) < 30) return rtf.format(diffInDays, 'day');

  const diffInMonths: number = Math.round(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) return rtf.format(diffInMonths, 'month');

  const diffInYears: number = Math.round(diffInDays / 365);
  return rtf.format(diffInYears, 'year');
}

export function checkTaskIsOverdue(dueDate: string | number | Date): boolean {
  const now = new Date();
  const due = new Date(
    typeof dueDate === 'number' && dueDate < 1e12 ? dueDate * 1000 : dueDate
  );
  return due < now;
}

export function checkTaskIsDueSoon(dueDate: string, hoursThreshold: number = 4): boolean {
  if (!dueDate) return false;

  const [date, time] = dueDate.split(' ');
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute, second] = time.split(':').map(Number);

  const due = new Date(year, month - 1, day, hour, minute, second);
  const now = new Date();

  const diffMs = due.getTime() - now.getTime();

  if (diffMs <= 0) return false;

  const thresholdMs = hoursThreshold * 60 * 60 * 1000;

  return diffMs <= thresholdMs;
}

export const getDefaultTimeRange = () => {
  const now = new Date();

  const start = new Date(now);
  start.setMinutes(0, 0, 0);

  const end = new Date(start);
  end.setHours(start.getHours() + 1);

  return { start, end };
};

export const formatTime = (value) => {
  if (!value) return null;
  return `${String(value.hour).padStart(2, '0')}:${String(value.minute).padStart(2, '0')}`;
};