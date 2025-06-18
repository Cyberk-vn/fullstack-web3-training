/**
 * Validate an email address
 */
export function isValidEmail(email: string): boolean {
  if (!email) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate a URL
 */
export function isValidUrl(url: string): boolean {
  if (!url) return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a string is empty or only whitespace
 */
export function isEmpty(value: string | null | undefined): boolean {
  return value === null || value === undefined || value.trim() === "";
}

/**
 * Validate a password (at least 8 chars, 1 uppercase, 1 lowercase, 1 number)
 */
export function isStrongPassword(password: string): boolean {
  if (!password || password.length < 8) return false;

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUppercase && hasLowercase && hasNumber;
}

/**
 * Validate a phone number (basic format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!phone) return false;

  // Removes all non-digit characters and checks if it's between 10-15 digits
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

/**
 * Validate a credit card number using Luhn algorithm
 */
export function isValidCreditCard(cardNumber: string): boolean {
  if (!cardNumber) return false;

  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i]);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validate an IPv4 address
 */
export function isValidIPv4(ip: string): boolean {
  if (!ip) return false;

  const parts = ip.split(".");
  if (parts.length !== 4) return false;

  return parts.every((part) => {
    const num = parseInt(part);
    return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
  });
}

/**
 * Validate a hexadecimal color code
 */
export function isValidHexColor(color: string): boolean {
  if (!color) return false;

  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Check if a string contains only alphabetic characters
 */
export function isAlpha(value: string): boolean {
  return /^[a-zA-Z]+$/.test(value);
}

/**
 * Check if a string contains only alphanumeric characters
 */
export function isAlphanumeric(value: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(value);
}

/**
 * Check if a string contains only numeric characters
 */
export function isNumeric(value: string): boolean {
  return /^\d+$/.test(value);
}

/**
 * Check if a value is a valid JSON string
 */
export function isValidJSON(value: string): boolean {
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate a postal code (supports various formats)
 */
export function isValidPostalCode(postalCode: string, country = "US"): boolean {
  if (!postalCode) return false;

  const patterns: Record<string, RegExp> = {
    US: /^\d{5}(-\d{4})?$/,
    CA: /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/,
    UK: /^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$/,
    DE: /^\d{5}$/,
    FR: /^\d{5}$/,
  };

  const pattern = patterns[country.toUpperCase()];
  return pattern ? pattern.test(postalCode) : false;
}

/**
 * Check if a string has minimum length
 */
export function hasMinLength(value: string, min: number): boolean {
  return Boolean(value && value.length >= min);
}

/**
 * Check if a string has maximum length
 */
export function hasMaxLength(value: string, max: number): boolean {
  return !value || value.length <= max;
}

/**
 * Check if a number is within a range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate a slug (URL-friendly string)
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
