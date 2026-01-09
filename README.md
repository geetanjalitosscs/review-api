# Reviews API

A production-ready REST API built with Next.js App Router and TypeScript, following MVC architecture.

## Project Structure

```
.
├── app/
│   ├── api/
│   │   └── reviews/
│   │       └── route.ts          # API route handlers (GET, POST)
│   ├── controllers/
│   │   └── reviewController.ts   # Business logic layer
│   ├── models/
│   │   └── Review.ts             # Data models and interfaces
│   ├── validators/
│   │   └── reviewValidator.ts    # Validation logic
│   └── utils/
│       ├── db.ts                 # Database connection utility
│       ├── validation.ts         # Validation utilities
│       └── response.ts           # Response formatters
├── .env.example                  # Environment variables template
├── package.json
├── tsconfig.json
└── README.md
```

## Architecture

This API follows the **MVC (Model-View-Controller)** pattern:

- **Models** (`app/models/`): TypeScript interfaces and data structures
- **Views** (`app/utils/response.ts`): Response formatting (API responses)
- **Controllers** (`app/controllers/`): Business logic and data operations
- **Validators** (`app/validators/`): Input validation logic

## Installation

```bash
npm install
```

## Database Setup

1. Make sure MySQL is running and you have phpMyAdmin access
2. Create a database named `review` (or use your existing database)
3. Create the `review` table using the provided schema:
```sql
CREATE TABLE review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    serial_no INT NOT NULL UNIQUE,
    review TEXT NOT NULL,
    status ENUM('PASS', 'FAIL') NOT NULL,
    mobile_no VARCHAR(15) NOT NULL,
    email VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

4. Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=review
```

## Development

```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/reviews`

## API Endpoints

### GET /api/reviews

Fetches all reviews.

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "serial_no": 1,
      "review": "Great product!",
      "status": "PASS"
    }
  ]
}
```

**Note:** The GET endpoint excludes `mobile_no` and `email` fields for privacy.

### POST /api/reviews

Creates a new review.

**Request Body:**
```json
{
  "serial_no": 1,
  "review": "Great product!",
  "status": "PASS",
  "mobile_no": "1234567890",
  "email": "user@example.com"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "message": "Review created successfully",
    "review": {
      "serial_no": 1,
      "review": "Great product!",
      "status": "PASS",
      "mobile_no": "1234567890",
      "email": "user@example.com"
    }
  }
}
```

**Error Responses:**

- **400 Bad Request** - Validation errors:
```json
{
  "success": false,
  "message": "Validation failed: email: email must be a valid email format"
}
```

- **409 Conflict** - Duplicate serial_no:
```json
{
  "success": false,
  "message": "Review with serial_no 1 already exists"
}
```

- **500 Internal Server Error** - Server errors:
```json
{
  "success": false,
  "message": "An error occurred while creating the review"
}
```

## Data Model

### Review Interface

```typescript
interface Review {
  serial_no: number;      // Required, unique
  review: string;         // Required
  status: "PASS" | "FAIL"; // Required, enum
  mobile_no: string;      // Required, exactly 10 digits
  email: string;          // Required, valid email format
}
```

### Review Response (GET)

```typescript
interface ReviewResponse {
  serial_no: number;
  review: string;
  status: "PASS" | "FAIL";
  // Note: mobile_no and email are excluded
}
```

## Validation Rules

- **serial_no**: Required, must be a number, must be unique
- **review**: Required, must be a non-empty string
- **status**: Required, must be either "PASS" or "FAIL"
- **mobile_no**: Required, must be exactly 10 digits
- **email**: Required, must be a valid email format

## HTTP Status Codes

- `200` - Success (GET requests)
- `201` - Created (POST requests)
- `400` - Bad Request (validation errors)
- `409` - Conflict (duplicate serial_no)
- `500` - Internal Server Error

## Database Integration

The API is now integrated with MySQL database. The connection is managed through:

- **Database Utility** (`app/utils/db.ts`): Connection pool management
- **Controller** (`app/controllers/reviewController.ts`): Database queries for CRUD operations

The database connection uses a connection pool for optimal performance and is configured via environment variables.

## TypeScript

This project uses strict TypeScript configuration. All types are properly defined and validated.

## License

MIT

