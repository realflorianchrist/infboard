export enum FolderValidationErrorType {
    NAME_EMPTY = "NAME_EMPTY",
    NAME_TOO_LONG = "NAME_TOO_LONG",
    ALREADY_EXISTS = "ALREADY_EXISTS",
}

export enum FileValidationErrorType {
    NAME_EMPTY = "NAME_EMPTY",
    NAME_TOO_LONG = "NAME_TOO_LONG",
    CONTENT_TYPE_EMPTY = "CONTENT_TYPE_EMPTY",
    VERSION_NEGATIVE = "VERSION_NEGATIVE",
    SIZE_NEGATIVE = "SIZE_NEGATIVE",
    ALREADY_EXISTS = "ALREADY_EXISTS",
}

export type ValidationErrorType =
    FolderValidationErrorType
    | FileValidationErrorType;