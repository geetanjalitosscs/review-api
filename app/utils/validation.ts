/**
 * Validation Utilities
 * Contains validation functions for review data
 */

/**
 * Validates email format using regex
 * @param email - Email string to validate
 * @returns true if email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates mobile number format (exactly 10 digits)
 * @param mobileNo - Mobile number string to validate
 * @returns true if mobile number is valid, false otherwise
 */
export function isValidMobileNumber(mobileNo: string): boolean {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobileNo);
}

/**
 * Validates review status enum value
 * @param status - Status string to validate
 * @returns true if status is valid, false otherwise
 */
export function isValidStatus(status: string): boolean {
  return status === 'PASS' || status === 'FAIL';
}

