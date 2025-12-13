export class ApiError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly response?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }

    isClientError(): boolean {
        return this.statusCode >= 400 && this.statusCode < 500;
    }

    isServerError(): boolean {
        return this.statusCode >= 500;
    }
}

export class NetworkError extends Error {
    constructor(message: string = 'Network request failed') {
        super(message);
        this.name = 'NetworkError';
    }
}

export class TimeoutError extends Error {
    constructor(message: string = 'Request timeout') {
        super(message);
        this.name = 'TimeoutError';
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string = 'BadRequest') {
        super(message, 400);
        this.name = 'BadRequestError';
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends ApiError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
    }
}