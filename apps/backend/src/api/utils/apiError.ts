import {ErrorType} from "@workspace/types/apiResponses";
import {StatusCodes} from "http-status-codes";
import {ValidationErrorType} from "@workspace/types/modelValidation";

type HttpStatusCode = typeof StatusCodes[keyof typeof StatusCodes];

type ApiErrorOptions = {
    validationErrors?: ValidationErrorType[];
};

export class ApiError extends Error {
    status: HttpStatusCode;
    errorType: ErrorType;
    validationErrors?: ValidationErrorType[];

    constructor(
        status: HttpStatusCode,
        errorType: ErrorType,
        options?: ApiErrorOptions
    ) {
        super(errorType);
        this.status = status;
        this.errorType = errorType;
        if (options?.validationErrors) {
            this.validationErrors = options.validationErrors;
        }
    }
}

