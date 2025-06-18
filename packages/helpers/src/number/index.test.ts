import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatCurrency,
  formatCompact,
  formatPercentage,
  roundTo,
  clamp,
  randomBetween,
  formatBytes,
  isEven,
  isOdd,
  average,
  sum,
  toOrdinal,
  isValidNumber,
  formatFileSize,
} from "./index";

describe("Number Utilities", () => {
  describe("formatNumber", () => {
    it("should format numbers with commas", () => {
      expect(formatNumber(1234.56)).toBe("1,234.56");
      expect(formatNumber(1000000)).toBe("1,000,000");
      expect(formatNumber(123.456, 0, 1)).toBe("123.5");
    });

    it("should handle invalid values", () => {
      expect(formatNumber(NaN)).toBe("");
      expect(formatNumber(null as unknown as number)).toBe("");
      expect(formatNumber(undefined as unknown as number)).toBe("");
    });
  });

  describe("formatCurrency", () => {
    it("should format currency values", () => {
      expect(formatCurrency(1234.56)).toBe("$1,234.56");
      expect(formatCurrency(1000, "EUR")).toBe("€1,000.00");
    });

    it("should handle invalid values", () => {
      expect(formatCurrency(NaN)).toBe("");
    });
  });

  describe("formatCompact", () => {
    it("should format numbers with suffixes", () => {
      expect(formatCompact(1500)).toBe("1.5K");
      expect(formatCompact(1500000)).toBe("1.5M");
      expect(formatCompact(1500000000)).toBe("1.5B");
      expect(formatCompact(1500000000000)).toBe("1.5T");
      expect(formatCompact(500)).toBe("500");
    });

    it("should handle negative numbers", () => {
      expect(formatCompact(-1500)).toBe("-1.5K");
    });

    it("should handle invalid values", () => {
      expect(formatCompact(NaN)).toBe("");
    });
  });

  describe("formatPercentage", () => {
    it("should format percentages", () => {
      expect(formatPercentage(0.1234)).toBe("12.34%");
      expect(formatPercentage(0.5, 0)).toBe("50%");
      expect(formatPercentage(1.25, 1)).toBe("125.0%");
    });

    it("should handle invalid values", () => {
      expect(formatPercentage(NaN)).toBe("");
    });
  });

  describe("roundTo", () => {
    it("should round to specified decimal places", () => {
      expect(roundTo(3.14159, 2)).toBe(3.14);
      expect(roundTo(3.14159, 0)).toBe(3);
      expect(roundTo(3.16, 1)).toBe(3.2);
    });

    it("should handle NaN", () => {
      expect(roundTo(NaN)).toBe(0);
    });
  });

  describe("clamp", () => {
    it("should clamp values within range", () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe("randomBetween", () => {
    it("should generate random numbers within range", () => {
      const result = randomBetween(1, 10);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
      expect(Number.isInteger(result)).toBe(true);
    });
  });

  describe("formatBytes", () => {
    it("should format byte values", () => {
      expect(formatBytes(0)).toBe("0 Bytes");
      expect(formatBytes(1024)).toBe("1 KB");
      expect(formatBytes(1048576)).toBe("1 MB");
      expect(formatBytes(1073741824)).toBe("1 GB");
      expect(formatBytes(1500)).toBe("1.46 KB");
    });
  });

  describe("isEven", () => {
    it("should check if number is even", () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(3)).toBe(false);
      expect(isEven(0)).toBe(true);
      expect(isEven(-2)).toBe(true);
    });
  });

  describe("isOdd", () => {
    it("should check if number is odd", () => {
      expect(isOdd(3)).toBe(true);
      expect(isOdd(2)).toBe(false);
      expect(isOdd(1)).toBe(true);
      expect(isOdd(-3)).toBe(true);
    });
  });

  describe("average", () => {
    it("should calculate average", () => {
      expect(average([1, 2, 3, 4, 5])).toBe(3);
      expect(average([10, 20])).toBe(15);
      expect(average([])).toBe(0);
    });
  });

  describe("sum", () => {
    it("should calculate sum", () => {
      expect(sum([1, 2, 3, 4, 5])).toBe(15);
      expect(sum([10, -5])).toBe(5);
      expect(sum([])).toBe(0);
    });
  });

  describe("toOrdinal", () => {
    it("should convert numbers to ordinals", () => {
      expect(toOrdinal(1)).toBe("1st");
      expect(toOrdinal(2)).toBe("2nd");
      expect(toOrdinal(3)).toBe("3rd");
      expect(toOrdinal(4)).toBe("4th");
      expect(toOrdinal(11)).toBe("11th");
      expect(toOrdinal(21)).toBe("21st");
      expect(toOrdinal(22)).toBe("22nd");
      expect(toOrdinal(23)).toBe("23rd");
    });
  });

  describe("isValidNumber", () => {
    it("should validate numbers", () => {
      expect(isValidNumber(123)).toBe(true);
      expect(isValidNumber(0)).toBe(true);
      expect(isValidNumber(-123)).toBe(true);
      expect(isValidNumber(NaN)).toBe(false);
      expect(isValidNumber(Infinity)).toBe(false);
      expect(isValidNumber("123")).toBe(false);
    });
  });

  describe("formatFileSize", () => {
    it("should format file sizes", () => {
      expect(formatFileSize(1024)).toBe("1 KB");
      expect(formatFileSize(1048576)).toBe("1 MB");
      expect(formatFileSize(0)).toBe("0 Bytes");
    });
  });
});
