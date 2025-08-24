import {Request, Response, NextFunction} from 'express';
import {ApiErrorResponse, ErrorType} from "@workspace/types/src/apiResponses";
import {ApiError} from "@src/api/utils/apiError";
import {StatusCodes} from "http-status-codes";
import logger from "jet-logger";


export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
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
