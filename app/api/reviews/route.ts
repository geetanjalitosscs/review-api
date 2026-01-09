import { NextRequest } from 'next/server';
import { getAllReviews, createReview, DuplicateSerialError, DatabaseError } from '@/app/controllers/reviewController';
import { ReviewValidator } from '@/app/validators/reviewValidator';
import { successResponse, errorResponse } from '@/app/utils/response';

/**
 * GET /api/reviews
 * Fetches all reviews
 * Returns only serial_no, review, and status (excludes mobile_no and email)
 */
export async function GET() {
  try {
    // Fetch all reviews from controller
    const reviews = await getAllReviews();

    // Return success response with reviews
    return successResponse(reviews, 200);
  } catch (error) {
    // Handle database errors
    if (error instanceof DatabaseError) {
      return errorResponse(error.message, 500);
    }

    // Handle unexpected errors
    console.error('Error fetching reviews:', error);
    return errorResponse(
      'An error occurred while fetching reviews',
      500
    );
  }
}

/**
 * POST /api/reviews
 * Creates a new review
 * Validates request body and checks for duplicate serial_no
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return errorResponse('Invalid JSON in request body', 400);
    }

    // Validate request data
    const validatedData = ReviewValidator.parseAndValidate(body);
    if (!validatedData) {
      const errors = ReviewValidator.validateCreateRequest(body);
      const errorMessages = errors.map((e) => `${e.field}: ${e.message}`).join(', ');
      return errorResponse(`Validation failed: ${errorMessages}`, 400);
    }

    // Create review via controller
    const review = await createReview(validatedData);

    // Return success response with created review
    return successResponse(
      {
        message: 'Review created successfully',
        review: review,
      },
      201
    );
  } catch (error) {
    // Handle duplicate serial_no error
    if (error instanceof DuplicateSerialError) {
      return errorResponse(error.message, 409);
    }

    // Handle database errors
    if (error instanceof DatabaseError) {
      return errorResponse(error.message, 500);
    }

    // Handle unexpected errors
    console.error('Error creating review:', error);
    return errorResponse(
      'An error occurred while creating the review',
      500
    );
  }
}

