export class AppError extends Error {
    statusCode;
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
export class NotFoundError extends AppError {
    constructor(resource) {
        super(404, `${resource} not found`);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(401, message);
    }
}
//# sourceMappingURL=errors.js.map