import { ReviewCreateRequest, ReviewStatus } from '@/app/models/Review';
import { isValidEmail, isValidMobileNumber, isValidStatus } from '@/app/utils/validation';

/**
 * Validation Error Interface
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Review Validator
 * Validates review creation requests
 */
export class ReviewValidator {
  /**
   * Validates a review creation request
   * @param data - Review data to validate
   * @returns Array of validation errors (empty if valid)
   */
  static validateCreateRequest(data: any): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate required fields
    if (data.serial_no === undefined || data.serial_no === null) {
      errors.push({ field: 'serial_no', message: 'serial_no is required' });
    } else if (typeof data.serial_no !== 'number') {
      errors.push({ field: 'serial_no', message: 'serial_no must be a number' });
    }

    if (!data.review || typeof data.review !== 'string' || data.review.trim() === '') {
      errors.push({ field: 'review', message: 'review is required and must be a non-empty string' });
    }

    if (!data.status) {
      errors.push({ field: 'status', message: 'status is required' });
    } else if (!isValidStatus(data.status)) {
      errors.push({ field: 'status', message: 'status must be either PASS or FAIL' });
    }

    if (!data.mobile_no || typeof data.mobile_no !== 'string') {
      errors.push({ field: 'mobile_no', message: 'mobile_no is required and must be a string' });
    } else if (!isValidMobileNumber(data.mobile_no)) {
      errors.push({ field: 'mobile_no', message: 'mobile_no must be exactly 10 digits' });
    }

    if (!data.email || typeof data.email !== 'string') {
      errors.push({ field: 'email', message: 'email is required and must be a string' });
    } else if (!isValidEmail(data.email)) {
      errors.push({ field: 'email', message: 'email must be a valid email format' });
    }

    return errors;
  }

  /**
   * Parses and validates request body
   * @param body - Request body (can be any type)
   * @returns Validated ReviewCreateRequest or null if invalid
   */
  static parseAndValidate(body: any): ReviewCreateRequest | null {
    const errors = this.validateCreateRequest(body);
    if (errors.length > 0) {
      return null;
    }

    return {
      serial_no: body.serial_no,
      review: body.review.trim(),
      status: body.status as ReviewStatus,
      mobile_no: body.mobile_no,
      email: body.email.trim().toLowerCase(),
    };
  }
}

