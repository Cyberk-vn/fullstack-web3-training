import {
  format,
  formatDistanceToNow,
  isValid,
  parseISO,
  addDays,
  addMonths,
  addYears,
  subDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  isBefore,
  isAfter,
  isSameDay,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from "date-fns";

/**
 * Formats a date to a human-readable string
 */
export function formatDate(
  date: Date | string,
  formatString = "yyyy-MM-dd"
): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";
    return format(dateObj, formatString);
  } catch {
    return "";
  }
}

/**
 * Formats a date to a time string
 */
export function formatTime(
  date: Date | string,
  formatString = "HH:mm"
): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";
    return format(dateObj, formatString);
  } catch {
    return "";
  }
}

/**
 * Formats a date to a full datetime string
 */
export function formatDateTime(
  date: Date | string,
  formatString = "yyyy-MM-dd HH:mm"
): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";
    return format(dateObj, formatString);
  } catch {
    return "";
  }
}

/**
 * Returns a relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    if (!isValid(dateObj)) return "";
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return "";
  }
}

/**
 * Checks if a date string or Date object is valid
 */
export function isValidDate(date: Date | string): boolean {
  try {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return isValid(dateObj);
  } catch {
    return false;
  }
}

/**
 * Gets the current date and time
 */
export function now(): Date {
  return new Date();
}

/**
 * Gets today's date at midnight
 */
export function today(): Date {
  return startOfDay(new Date());
}

/**
 * Gets tomorrow's date at midnight
 */
export function tomorrow(): Date {
  return addDays(today(), 1);
}

/**
 * Gets yesterday's date at midnight
 */
export function yesterday(): Date {
  return subDays(today(), 1);
}

/**
 * Adds days to a date
 */
export function addDaysToDate(date: Date | string, days: number): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return addDays(dateObj, days);
}

/**
 * Subtracts days from a date
 */
export function subtractDaysFromDate(date: Date | string, days: number): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return subDays(dateObj, days);
}

/**
 * Adds months to a date
 */
export function addMonthsToDate(date: Date | string, months: number): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return addMonths(dateObj, months);
}

/**
 * Adds years to a date
 */
export function addYearsToDate(date: Date | string, years: number): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return addYears(dateObj, years);
}

/**
 * Gets the start of day for a given date
 */
export function getStartOfDay(date: Date | string): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return startOfDay(dateObj);
}

/**
 * Gets the end of day for a given date
 */
export function getEndOfDay(date: Date | string): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return endOfDay(dateObj);
}

/**
 * Gets the start of week for a given date
 */
export function getStartOfWeek(date: Date | string): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return startOfWeek(dateObj);
}

/**
 * Gets the end of week for a given date
 */
export function getEndOfWeek(date: Date | string): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return endOfWeek(dateObj);
}

/**
 * Gets the start of month for a given date
 */
export function getStartOfMonth(date: Date | string): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return startOfMonth(dateObj);
}

/**
 * Gets the end of month for a given date
 */
export function getEndOfMonth(date: Date | string): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return endOfMonth(dateObj);
}

/**
 * Gets the start of year for a given date
 */
export function getStartOfYear(date: Date | string): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return startOfYear(dateObj);
}

/**
 * Gets the end of year for a given date
 */
export function getEndOfYear(date: Date | string): Date {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return endOfYear(dateObj);
}

/**
 * Checks if first date is before second date
 */
export function isDateBefore(
  date1: Date | string,
  date2: Date | string
): boolean {
  const dateObj1 = typeof date1 === "string" ? parseISO(date1) : date1;
  const dateObj2 = typeof date2 === "string" ? parseISO(date2) : date2;
  return isBefore(dateObj1, dateObj2);
}

/**
 * Checks if first date is after second date
 */
export function isDateAfter(
  date1: Date | string,
  date2: Date | string
): boolean {
  const dateObj1 = typeof date1 === "string" ? parseISO(date1) : date1;
  const dateObj2 = typeof date2 === "string" ? parseISO(date2) : date2;
  return isAfter(dateObj1, dateObj2);
}

/**
 * Checks if two dates are the same day
 */
export function isSameDayAs(
  date1: Date | string,
  date2: Date | string
): boolean {
  const dateObj1 = typeof date1 === "string" ? parseISO(date1) : date1;
  const dateObj2 = typeof date2 === "string" ? parseISO(date2) : date2;
  return isSameDay(dateObj1, dateObj2);
}

/**
 * Gets the difference in days between two dates
 */
export function getDaysDifference(
  date1: Date | string,
  date2: Date | string
): number {
  const dateObj1 = typeof date1 === "string" ? parseISO(date1) : date1;
  const dateObj2 = typeof date2 === "string" ? parseISO(date2) : date2;
  return differenceInDays(dateObj1, dateObj2);
}

/**
 * Gets the difference in hours between two dates
 */
export function getHoursDifference(
  date1: Date | string,
  date2: Date | string
): number {
  const dateObj1 = typeof date1 === "string" ? parseISO(date1) : date1;
  const dateObj2 = typeof date2 === "string" ? parseISO(date2) : date2;
  return differenceInHours(dateObj1, dateObj2);
}

/**
 * Gets the difference in minutes between two dates
 */
export function getMinutesDifference(
  date1: Date | string,
  date2: Date | string
): number {
  const dateObj1 = typeof date1 === "string" ? parseISO(date1) : date1;
  const dateObj2 = typeof date2 === "string" ? parseISO(date2) : date2;
  return differenceInMinutes(dateObj1, dateObj2);
}

/**
 * Converts a Date to ISO string
 */
export function toISOString(date: Date): string {
  return date.toISOString();
}

/**
 * Parses an ISO string to Date
 */
export function fromISOString(isoString: string): Date {
  return parseISO(isoString);
}

/**
 * Gets age from birth date
 */
export function getAge(birthDate: Date | string): number {
  const dateObj =
    typeof birthDate === "string" ? parseISO(birthDate) : birthDate;
  const today = new Date();
  const age = today.getFullYear() - dateObj.getFullYear();
  const monthDiff = today.getMonth() - dateObj.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateObj.getDate())
  ) {
    return age - 1;
  }

  return age;
}

/**
 * Checks if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return isBefore(dateObj, new Date());
}

/**
 * Checks if a date is in the future
 */
export function isFuture(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return isAfter(dateObj, new Date());
}

/**
 * Checks if a date is today
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return isSameDay(dateObj, new Date());
}
