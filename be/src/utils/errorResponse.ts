import { Response } from "express";

/**
 * Standard API error response structure
 */
export interface ApiErrorResponse {
    success: false;
    error: {
        message: string;
        code?: string;
        details?: Record<string, any>;
    };
    timestamp: string;
}

/**
 * Standard API success response structure
 */
export interface ApiSuccessResponse<T = any> {
    success: true;
    data: T;
    timestamp: string;
}

/**
 * Sends a standardized error response
 * 
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @param code - Optional error code for client-side handling
 * @param details - Optional additional error details
 */
export function sendErrorResponse(
    res: Response,
    statusCode: number,
    message: string,
    code?: string,
    details?: Record<string, any>
): void {
    const errorResponse: ApiErrorResponse = {
        success: false,
        error: {
            message,
            ...(code && { code }),
            ...(details && { details }),
        },
        timestamp: new Date().toISOString(),
    };

    res.status(statusCode).json(errorResponse);
}

/**
 * Sends a standardized success response
 * 
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param data - Response data
 */
export function sendSuccessResponse<T>(
    res: Response,
    statusCode: number,
    data: T
): void {
    const successResponse: ApiSuccessResponse<T> = {
        success: true,
        data,
        timestamp: new Date().toISOString(),
    };

    res.status(statusCode).json(successResponse);
}

/**
 * Common error response helpers
 */
export const ErrorResponses = {
    badRequest: (res: Response, message: string, details?: Record<string, any>) =>
        sendErrorResponse(res, 400, message, "BAD_REQUEST", details),

    unauthorized: (res: Response, message = "Unauthorized") =>
        sendErrorResponse(res, 401, message, "UNAUTHORIZED"),

    forbidden: (res: Response, message = "Forbidden") =>
        sendErrorResponse(res, 403, message, "FORBIDDEN"),

    notFound: (res: Response, message = "Resource not found") =>
        sendErrorResponse(res, 404, message, "NOT_FOUND"),

    conflict: (res: Response, message: string) =>
        sendErrorResponse(res, 409, message, "CONFLICT"),

    unprocessableEntity: (res: Response, message: string, details?: Record<string, any>) =>
        sendErrorResponse(res, 422, message, "UNPROCESSABLE_ENTITY", details),

    internalServerError: (res: Response, message = "Internal server error") =>
        sendErrorResponse(res, 500, message, "INTERNAL_SERVER_ERROR"),
};
