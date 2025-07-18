export enum FolderValidationErrorType {
    NAME_EMPTY = "FOLDER_NAME_EMPTY",
    ALREADY_EXISTS = "FOLDER_ALREADY_EXISTS",
}

export enum FileValidationErrorType {
    NAME_EMPTY = "FILE_NAME_EMPTY",
    TOO_LARGE = "FILE_TOO_LARGE",
}

export type ValidationErrorType =
    FolderValidationErrorType
    | FileValidationErrorType;