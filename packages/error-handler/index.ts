export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;
    public readonly details: any;

    constructor(
        message: string,
        statusCode: number,
        isOperational = true,
        details?: any
    ) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        this.details = details;
        Error.captureStackTrace(this);
    }
}

// Not found error
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

// Validation Error 
export class ValidationError extends AppError {
    constructor(message = "Invalid request data", details?: any) {
        super(message, 400, true, details);
    }
}

// Authentication Error
export class AuthError extends AppError {
    constructor(message = "Authentication failed") {
        super(message, 401);
    }
}

// Forbidden Error (For insufficient permissions)
export class ForbiddenError extends AppError {
    constructor(message = "You do not have permission to access this resource") {
        super(message, 403);
    }
}

//  Database Error (For MongoDB or SQL errors)
export class DatabaseError extends AppError {
    constructor(message = "A database error occurred", details?: any) {
        super(message, 500, true, details);
    }
}

//  Rate limit Error (If user exceeds API rate limits)
export class RateLimitError extends AppError {
    constructor(message = "Too many requests, please try again later.") {
        super(message, 429);
    }
}