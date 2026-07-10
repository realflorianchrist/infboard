import {Request, Response, NextFunction} from 'express';
import {ApiErrorResponse, ErrorType} from "@workspace/types";
import {ApiError} from "@src/api/utils/apiError";
import {StatusCodes} from "http-status-codes";
import logger from "@src/utils/logger";

/**
 * Global Express error handling middleware.
 *
 * Behavior:
 * - Handles known {@link ApiError} instances and maps them to a structured API response.
 * - Falls back to `INTERNAL_SERVER_ERROR` for unknown or unhandled errors.
 * - Logs unhandled errors using the application logger.
 * - Always responds with a JSON object matching {@link ApiErrorResponse}.
 *
 * Response format:
 * ```
 * {
 *   errorType: ErrorType,
 *   validationErrors?: ValidationErrorType[]
 * }
 * ```
 *
 * Notes:
 * - This middleware should be registered after all routes and other middleware.
 * - The `next` parameter is required by Express to recognize this as an error handler.
 *
 * @param {unknown} err The error thrown or passed via `next(err)`.
 * @param {Request} req Express request object.
 * @param {Response} res Express response object used to send the error response.
 * @param {NextFunction} next Express next function (not used directly).
 * @returns {void}
 */
export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    let errorType: ErrorType = ErrorType.INTERNAL_SERVER_ERROR;
    let status = StatusCodes.INTERNAL_SERVER_ERROR;
    let validationErrors;

    if (err instanceof ApiError && err.errorType) {
        errorType = err.errorType;
        status = err.status;
        validationErrors = err.validationErrors;
    } else {
        logger.err(`Unhandled Error: ${err}`);
    }

    const errorResponse: ApiErrorResponse = {
        errorType: errorType,
        validationErrors: validationErrors,
    }

    res.status(status).json(errorResponse);
}
