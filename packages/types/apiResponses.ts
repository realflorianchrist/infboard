export enum ErrorType {
    USER_ALREADY_EXISTS = "USER_ALREADY_EXISTS",
    USER_NOT_FOUND = "USER_NOT_FOUND",
    INVALID_PASSWORD = "INVALID_PASSWORD",
    TOKEN_MISSING = "TOKEN_MISSING",
    TOKEN_INVALID = "TOKEN_INVALID",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    API_ERROR = "API_ERROR",
    INTERNAL_SERVER_ERROR =  "INTERNAL_SERVER_ERROR",
}

export type ApiErrorResponse = {
    errorType: ErrorType;
}

export type ApiResponse<T> = T | ApiErrorResponse;