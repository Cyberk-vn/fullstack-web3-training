import { describe, it, expect } from "vitest";
import {
  formatDate,
  formatTime,
  formatDateTime,
  formatRelativeTime,
  isValidDate,
  now,
  today,
  tomorrow,
  yesterday,
  addDaysToDate,
  subtractDaysFromDate,
  addMonthsToDate,
  addYearsToDate,
  getStartOfDay,
  getEndOfDay,
  isDateBefore,
  isDateAfter,
  isSameDayAs,
  getDaysDifference,
  getHoursDifference,
  getMinutesDifference,
  toISOString,
  fromISOString,
  getAge,
  isPast,
  isFuture,
  isToday,
} from "./index";

describe("DateTime Utilities", () => {
  const testDate = new Date("2024-01-15T10:30:00");
  const testDateString = "2024-01-15T10:30:00";

  describe("formatDate", () => {
    it("should format dates with default format", () => {
      expect(formatDate(testDate)).toBe("2024-01-15");
    });

    it("should format dates with custom format", () => {
      expect(formatDate(testDate, "dd/MM/yyyy")).toBe("15/01/2024");
    });

    it("should handle string dates", () => {
      expect(formatDate(testDateString)).toBe("2024-01-15");
    });

    it("should handle invalid dates", () => {
      expect(formatDate("invalid")).toBe("");
    });
  });

  describe("formatTime", () => {
    it("should format time with default format", () => {
      expect(formatTime(testDate)).toBe("10:30");
    });

    it("should format time with custom format", () => {
      expect(formatTime(testDate, "h:mm a")).toBe("10:30 AM");
    });
  });

  describe("formatDateTime", () => {
    it("should format datetime with default format", () => {
      expect(formatDateTime(testDate)).toBe("2024-01-15 10:30");
    });

    it("should format datetime with custom format", () => {
      expect(formatDateTime(testDate, "dd/MM/yyyy HH:mm")).toBe(
        "15/01/2024 10:30"
      );
    });
  });

  describe("formatRelativeTime", () => {
    it("should format relative time", () => {
      const pastDate = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
      const result = formatRelativeTime(pastDate);
      expect(result).toContain("hours ago");
    });
  });

  describe("isValidDate", () => {
    it("should validate dates", () => {
      expect(isValidDate(testDate)).toBe(true);
      expect(isValidDate(testDateString)).toBe(true);
      expect(isValidDate("invalid")).toBe(false);
      expect(isValidDate(new Date("invalid"))).toBe(false);
    });
  });

  describe("now", () => {
    it("should return current date", () => {
      const currentTime = now();
      expect(currentTime).toBeInstanceOf(Date);
      expect(Math.abs(currentTime.getTime() - Date.now())).toBeLessThan(1000);
    });
  });

  describe("today", () => {
    it("should return today at midnight", () => {
      const todayDate = today();
      expect(todayDate.getHours()).toBe(0);
      expect(todayDate.getMinutes()).toBe(0);
      expect(todayDate.getSeconds()).toBe(0);
    });
  });

  describe("tomorrow", () => {
    it("should return tomorrow at midnight", () => {
      const tomorrowDate = tomorrow();
      const todayDate = today();
      expect(getDaysDifference(tomorrowDate, todayDate)).toBe(1);
    });
  });

  describe("yesterday", () => {
    it("should return yesterday at midnight", () => {
      const yesterdayDate = yesterday();
      const todayDate = today();
      expect(getDaysDifference(todayDate, yesterdayDate)).toBe(1);
    });
  });

  describe("addDaysToDate", () => {
    it("should add days to date", () => {
      const result = addDaysToDate(testDate, 5);
      expect(getDaysDifference(result, testDate)).toBe(5);
    });

    it("should handle string dates", () => {
      const result = addDaysToDate(testDateString, 3);
      expect(getDaysDifference(result, new Date(testDateString))).toBe(3);
    });
  });

  describe("subtractDaysFromDate", () => {
    it("should subtract days from date", () => {
      const result = subtractDaysFromDate(testDate, 5);
      expect(getDaysDifference(testDate, result)).toBe(5);
    });
  });

  describe("addMonthsToDate", () => {
    it("should add months to date", () => {
      const result = addMonthsToDate(testDate, 2);
      expect(result.getMonth()).toBe((testDate.getMonth() + 2) % 12);
    });
  });

  describe("addYearsToDate", () => {
    it("should add years to date", () => {
      const result = addYearsToDate(testDate, 1);
      expect(result.getFullYear()).toBe(testDate.getFullYear() + 1);
    });
  });

  describe("getStartOfDay", () => {
    it("should get start of day", () => {
      const result = getStartOfDay(testDate);
      expect(result.getHours()).toBe(0);
      expect(result.getMinutes()).toBe(0);
      expect(result.getSeconds()).toBe(0);
    });
  });

  describe("getEndOfDay", () => {
    it("should get end of day", () => {
      const result = getEndOfDay(testDate);
      expect(result.getHours()).toBe(23);
      expect(result.getMinutes()).toBe(59);
      expect(result.getSeconds()).toBe(59);
    });
  });

  describe("date comparisons", () => {
    const date1 = new Date("2024-01-15");
    const date2 = new Date("2024-01-16");

    it("should check if date is before another", () => {
      expect(isDateBefore(date1, date2)).toBe(true);
      expect(isDateBefore(date2, date1)).toBe(false);
    });

    it("should check if date is after another", () => {
      expect(isDateAfter(date2, date1)).toBe(true);
      expect(isDateAfter(date1, date2)).toBe(false);
    });

    it("should check if dates are same day", () => {
      const sameDay = new Date("2024-01-15T15:30:00");
      expect(isSameDayAs(date1, sameDay)).toBe(true);
      expect(isSameDayAs(date1, date2)).toBe(false);
    });
  });

  describe("date differences", () => {
    const date1 = new Date("2024-01-15T10:00:00");
    const date2 = new Date("2024-01-17T12:30:00");

    it("should calculate days difference", () => {
      expect(getDaysDifference(date2, date1)).toBe(2);
    });

    it("should calculate hours difference", () => {
      const hoursDiff = getHoursDifference(date2, date1);
      expect(hoursDiff).toBe(50); // 2 days + 2.5 hours = 50.5 hours, but function returns 50
    });

    it("should calculate minutes difference", () => {
      const minutesDiff = getMinutesDifference(date2, date1);
      expect(minutesDiff).toBe(3030); // 50.5 hours * 60 = 3030 minutes
    });
  });

  describe("ISO string conversion", () => {
    it("should convert to ISO string", () => {
      const isoString = toISOString(testDate);
      expect(isoString).toBe(testDate.toISOString());
    });

    it("should parse from ISO string", () => {
      const parsedDate = fromISOString(testDateString);
      expect(parsedDate.getFullYear()).toBe(2024);
      expect(parsedDate.getMonth()).toBe(0); // January is 0
      expect(parsedDate.getDate()).toBe(15);
      expect(parsedDate.getHours()).toBe(10);
      expect(parsedDate.getMinutes()).toBe(30);
    });
  });

  describe("getAge", () => {
    it("should calculate age correctly", () => {
      const birthDate = new Date("1990-01-15");
      const age = getAge(birthDate);
      const currentYear = new Date().getFullYear();
      const expectedAge = currentYear - 1990;
      expect(age).toBeCloseTo(expectedAge, 0);
    });
  });

  describe("date status checks", () => {
    it("should check if date is in the past", () => {
      const pastDate = new Date("2020-01-01");
      const futureDate = new Date("2030-01-01");
      expect(isPast(pastDate)).toBe(true);
      expect(isPast(futureDate)).toBe(false);
    });

    it("should check if date is in the future", () => {
      const pastDate = new Date("2020-01-01");
      const futureDate = new Date("2030-01-01");
      expect(isFuture(futureDate)).toBe(true);
      expect(isFuture(pastDate)).toBe(false);
    });

    it("should check if date is today", () => {
      const todayDate = new Date();
      const notTodayDate = new Date("2020-01-01");
      expect(isToday(todayDate)).toBe(true);
      expect(isToday(notTodayDate)).toBe(false);
    });
  });
});
