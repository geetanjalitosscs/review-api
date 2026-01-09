import { Review, ReviewResponse, ReviewCreateRequest } from '@/app/models/Review';
import { query } from '@/app/utils/db';

/**
 * Review Controller
 * Handles business logic for review operations
 * Uses MySQL database for data persistence
 */

/**
 * Custom error class for duplicate serial numbers
 */
export class DuplicateSerialError extends Error {
  constructor(serialNo: number) {
    super(`Review with serial_no ${serialNo} already exists`);
    this.name = 'DuplicateSerialError';
  }
}

/**
 * Custom error class for database errors
 */
export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Get all reviews
 * Returns only serial_no, review, and status (excludes mobile_no and email)
 * @returns Array of review responses
 */
export async function getAllReviews(): Promise<ReviewResponse[]> {
  try {
    const results = await query<Review[]>(
      'SELECT serial_no, review, status FROM review ORDER BY createdAt DESC'
    );

    return results.map((row) => ({
      serial_no: row.serial_no,
      review: row.review,
      status: row.status,
    }));
  } catch (error) {
    console.error('Database error in getAllReviews:', error);
    throw new DatabaseError('Failed to fetch reviews from database');
  }
}

/**
 * Create a new review
 * Validates data and checks for duplicate serial_no
 * @param reviewData - Review data to create
 * @returns Created review
 * @throws DuplicateSerialError if serial_no already exists
 * @throws DatabaseError if database operation fails
 */
export async function createReview(
  reviewData: ReviewCreateRequest
): Promise<Review> {
  try {
    // Check for duplicate serial_no
    const existing = await query<Review[]>(
      'SELECT serial_no FROM review WHERE serial_no = ?',
      [reviewData.serial_no]
    );

    if (existing.length > 0) {
      throw new DuplicateSerialError(reviewData.serial_no);
    }

    // Insert new review into database
    const insertResult = await query<any>(
      `INSERT INTO review (serial_no, review, status, mobile_no, email) 
       VALUES (?, ?, ?, ?, ?)`,
      [
        reviewData.serial_no,
        reviewData.review,
        reviewData.status,
        reviewData.mobile_no,
        reviewData.email,
      ]
    );

    // Fetch the created review from database
    const insertId = (insertResult as any).insertId;
    const createdReview = await query<Review[]>(
      'SELECT * FROM review WHERE id = ?',
      [insertId]
    );

    if (createdReview.length === 0) {
      throw new DatabaseError('Failed to retrieve created review');
    }

    return createdReview[0];
  } catch (error) {
    // Re-throw custom errors
    if (error instanceof DuplicateSerialError) {
      throw error;
    }

    // Handle MySQL duplicate entry error (1062)
    if (error instanceof Error && 'code' in error && error.code === 'ER_DUP_ENTRY') {
      throw new DuplicateSerialError(reviewData.serial_no);
    }

    console.error('Database error in createReview:', error);
    throw new DatabaseError('Failed to create review in database');
  }
}

