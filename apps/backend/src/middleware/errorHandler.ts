import {Request, Response, NextFunction} from 'express';
import {ErrorType} from "@workspace/types/apiResponses";


export function errorHandler(
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let errorType: ErrorType = ErrorType.API_ERROR;

    // if (err instanceof AppError && err.errorType) {
    //     errorType = err.errorType;
    // } else {
    //     logger.error("Unhandled Error:", err);
    // }
    //
    // const statusCode = ERROR_STATUS_MAP[errorType] || 400;

    res.status(400).json({
        errorType: errorType,
    });
}
