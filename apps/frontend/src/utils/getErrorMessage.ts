import {ErrorType} from "@workspace/types/apiResponses";
import {
    FileValidationErrorType,
    FolderValidationErrorType,
    ValidationErrorType
} from "@workspace/types/modelValidation";


const validationErrorMessages: Record<ValidationErrorType, string> = {
    // Folder errors
    [FolderValidationErrorType.FOLDER_NAME_EMPTY]: "Der Ordnername darf nicht leer sein.",
    [FolderValidationErrorType.FOLDER_NAME_TOO_LONG]: "Der Ordnername ist zu lang.",
    [FolderValidationErrorType.FOLDER_ALREADY_EXISTS]: "Ein Ordner mit diesem Namen existiert bereits.",

    // File errors
    [FileValidationErrorType.FILE_NAME_EMPTY]: "Der Dateiname darf nicht leer sein.",
    [FileValidationErrorType.FILE_NAME_TOO_LONG]: "Der Dateiname ist zu lang.",
    [FileValidationErrorType.FILE_CONTENT_TYPE_EMPTY]: "Der Dateityp fehlt.",
    [FileValidationErrorType.FILE_VERSION_NEGATIVE]: "Die Version darf nicht negativ sein.",
    [FileValidationErrorType.FILE_SIZE_NEGATIVE]: "Die Dateigröße darf nicht negativ sein.",
    [FileValidationErrorType.FILE_ALREADY_EXISTS]: "Eine Datei mit diesem Namen existiert bereits.",
};

const generalErrorMessages: Record<ErrorType, string> = {
    [ErrorType.NOT_FOUND]: "Die Ressource wurde nicht gefunden.",
    [ErrorType.USER_ALREADY_EXISTS]: "Ein Benutzer mit dieser E-Mail existiert bereits.",
    [ErrorType.USER_NOT_FOUND]: "Benutzer wurde nicht gefunden.",
    [ErrorType.INVALID_PASSWORD]: "Das Passwort ist ungültig.",
    [ErrorType.TOKEN_MISSING]: "Authentifizierungstoken fehlt.",
    [ErrorType.TOKEN_INVALID]: "Authentifizierungstoken ist ungültig oder abgelaufen.",
    [ErrorType.FOLDER_NOT_FOUND]: "Der Ordner wurde nicht gefunden.",
    [ErrorType.FILE_NOT_FOUND]: "Die Datei wurde nicht gefunden.",
    [ErrorType.VALIDATION_ERROR]: "Die Eingabe enthält ungültige Werte.",
    [ErrorType.ALREADY_EXISTS]: "Das Objekt existiert bereits.",
    [ErrorType.API_ERROR]: "Es ist ein Fehler bei der Anfrage aufgetreten.",
    [ErrorType.INTERNAL_SERVER_ERROR]: "Ein interner Serverfehler ist aufgetreten.",
    [ErrorType.UPLOAD_ERROR]: "Beim upload ist ein Fehler aufgetreten.",
};

export const getErrorMessage = (error: ErrorType | ValidationErrorType): string => {
    if (error in validationErrorMessages) {
        return validationErrorMessages[error as ValidationErrorType];
    }

    if (error in generalErrorMessages) {
        return generalErrorMessages[error as ErrorType];
    }

    return "Unbekannter Fehler";
};