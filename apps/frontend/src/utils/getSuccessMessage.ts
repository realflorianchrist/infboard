enum FolderSuccessMessage {
    FOLDER_CREATED = "Ordner erfolgreich erstellt.",
    FOLDER_MOVED = "Ordner erfolgreich verschoben.",
    FOLDER_DELETED = "Ordner erfolgreich gelöscht.",
    FOLDER_RENAMED = "Ordner erfolgreich umbenannt.",
    FOLDER_UNDELETED = "Ordner erfolgreich wiederhergestellt.",
}

enum FileSuccessMessage {
    FILE_UPLOADED = "Datei erfolgreich hochgeladen.",
    FILE_MOVED = "Datei erfolgreich verschoben.",
    FILES_MOVED = "Dateien erfolgreich verschoben.",
    FILE_DELETED = "Datei erfolgreich gelöscht.",
    FILE_UNDELETED = "Datei erfolgreich wiederhergestellt.",
}


enum UserSuccessMessage {
    LOGIN_SUCCESSFUL = "Login erfolgreich",
    REGISTER_SUCCESSFUL = "Registrierung erfolgreich",
    LOGOUT_SUCCESSFUL = "Logout erfolgreich",
}

export const successMessage = {
    ...FolderSuccessMessage,
    ...FileSuccessMessage,
    ...UserSuccessMessage,
}