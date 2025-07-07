import {ErrorType} from "@workspace/types/apiResponses";
import {StatusCodes} from "http-status-codes";

type HttpStatusCode = typeof StatusCodes[keyof typeof StatusCodes];

export class ApiError extends Error {
    status: HttpStatusCode;
    errorType: ErrorType;

    constructor(status: HttpStatusCode, errorType: ErrorType) {
        super(errorType);
        this.status = status;
        this.errorType = errorType;
    }
}
