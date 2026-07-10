import {ErrorType, ValidationErrorType} from "@workspace/types";
import {StatusCodes} from "http-status-codes";

/**
 * Union type representing any valid HTTP status code value
 * from {@link StatusCodes}.
 */
type HttpStatusCode = typeof StatusCodes[keyof typeof StatusCodes];


/**
 * Optional configuration for {@link ApiError}.
 *
 * @property {ValidationErrorType[]} [validationErrors]
 * Optional list of validation error identifiers returned to the client.
 */
type ApiErrorOptions = {
    validationErrors?: ValidationErrorType[];
};

/**
 * Custom application error used throughout the API.
 *
 * Purpose:
 * - Represents expected, controlled API errors.
 * - Carries an HTTP status code and a machine-readable error type.
 * - Optionally includes validation error details.
 *
 * Integration:
 * - Thrown in services, validators, and middleware.
 * - Interpreted by the global error handler to produce a consistent API response.
 */
export class ApiError extends Error {
    /**
     * HTTP status code to return to the client.
     */
    status: HttpStatusCode;

    /**
     * Application-specific error identifier.
     */
    errorType: ErrorType;

    /**
     * Optional list of validation error identifiers.
     */
    validationErrors?: ValidationErrorType[];

    /**
     * Creates a new API error instance.
     *
     * @param {HttpStatusCode} status HTTP status code for the response.
     * @param {ErrorType} errorType Machine-readable error identifier.
     * @param {ApiErrorOptions} [options] Optional additional error details.
     */
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

