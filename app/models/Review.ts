/**
 * Review Status Enum
 * Defines the possible status values for a review
 */
export enum ReviewStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
}

/**
 * Review Model Interface
 * Full review data structure including all fields from database
 */
export interface Review {
  id?: number; // Auto-increment primary key from database
  serial_no: number;
  review: string;
  status: ReviewStatus;
  mobile_no: string;
  email: string;
  createdAt?: Date | string; // Timestamp from database
}

/**
 * Review Response Interface
 * Response structure for GET requests (excludes sensitive fields)
 */
export interface ReviewResponse {
  serial_no: number;
  review: string;
  status: ReviewStatus;
}

/**
 * Review Create Request Interface
 * Request body structure for POST requests
 */
export interface ReviewCreateRequest {
  serial_no: number;
  review: string;
  status: ReviewStatus;
  mobile_no: string;
  email: string;
}

