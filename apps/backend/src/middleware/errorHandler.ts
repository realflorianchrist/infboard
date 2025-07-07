import {Request, Response, NextFunction} from 'express';
import {ApiErrorResponse, ErrorType} from "@workspace/types/apiResponses";
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

    if (err instanceof ApiError && err.errorType) {
        errorType = err.errorType;
        status = err.status;
    } else {
        logger.err(`Unhandled Error: ${err}`);
    }

    const errorResponse: ApiErrorResponse = {
        errorType: errorType,
    }

    res.status(status).json(errorResponse);
}
