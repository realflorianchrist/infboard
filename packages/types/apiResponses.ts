import {ValidationErrorType} from "./modelValidation";

export enum ErrorType {
    USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    INVALID_PASSWORD = "INVALID_PASSWORD",
    TOKEN_MISSING = "TOKEN_MISSING",
    TOKEN_INVALID = "TOKEN_INVALID",

    FOLDER_NOT_FOUND = "FOLDER_NOT_FOUND",

    FILE_NOT_FOUND = "FILE_NOT_FOUND",

    VALIDATION_ERROR = "VALIDATION_ERROR",

    API_ERROR = "API_ERROR",
    NOT_FOUND = "NOT_FOUND",
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export type ApiErrorResponse = {
    errorType: ErrorType;
    validationErrors?: ValidationErrorType[];
}

export type ApiResponse<T> = T | ApiErrorResponse;