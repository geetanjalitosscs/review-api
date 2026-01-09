import { NextResponse } from 'next/server';
import { ReviewResponse } from '@/app/models/Review';

/**
 * Response Utilities
 * Standardized API response formatters
 */

/**
 * Success response formatter
 * @param data - Data to return in response
 * @param statusCode - HTTP status code (default: 200)
 * @returns NextResponse with success format
 */
export function successResponse<T>(
  data: T,
  statusCode: number = 200
): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status: statusCode }
  );
}

/**
 * Error response formatter
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 400)
 * @returns NextResponse with error format
 */
export function errorResponse(
  message: string,
  statusCode: number = 400
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status: statusCode }
  );
}

