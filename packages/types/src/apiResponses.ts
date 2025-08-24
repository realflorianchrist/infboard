import {ValidationErrorType} from "./modelValidation";

export enum ErrorType {
    USER_NOT_FOUND = "USER_NOT_FOUND",
    BAD_CREDENTIALS = "BAD_CREDENTIALS",
    TOKEN_MISSING = "TOKEN_MISSING",
    TOKEN_INVALID = "TOKEN_INVALID",

    FOLDER_NOT_FOUND = "FOLDER_NOT_FOUND",
    FOLDER_DELETION_FAILED = "FOLDER_DELETION_FAILED",

    FILE_NOT_FOUND = "FILE_NOT_FOUND",
    FILE_DELETION_FAILED = "FILE_DELETION_FAILED",

    VALIDATION_ERROR = "VALIDATION_ERROR",

    ALREADY_EXISTS = "ALREADY_EXISTS",

    API_ERROR = "API_ERROR",
    NOT_FOUND = "NOT_FOUND",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",

    UPLOAD_ERROR = "UPLOAD_ERROR",
    DOWNLOAD_ERROR = "DOWNLOAD_ERROR",
}

export type ApiErrorResponse = {
    errorType: ErrorType;
    validationErrors?: ValidationErrorType[];
}

export type ApiResponse<T> = T | ApiErrorResponse;