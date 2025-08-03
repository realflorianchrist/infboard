enum FolderSuccessMessage {
    FOLDER_CREATED = "Ordner erfolgreich erstellt.",
    FOLDER_MOVED = "Ordner erfolgreich verschoben.",
    FOLDER_DELETED = "Ordner erfolgreich gelöscht.",
    FOLDER_RENAMED = "Ordner erfolgreich umbenannt.",
}

enum FileSuccessMessage {
    FILE_UPLOADED = "Datei erfolgreich hochgeladen.",
    FILE_MOVED = "Datei erfolgreich verschoben.",
    FILES_MOVED = "Dateien erfolgreich verschoben.",
    FILE_DELETED = "Datei erfolgreich gelöscht.",
}


enum UserSuccessMessage {
    LOGIN_SUCCESSFUL = "Login erfolgreich",
    REGISTER_SUCCESSFUL = "Registrierung erfolgreich",
}

export const successMessage = {
    ...FolderSuccessMessage,
    ...FileSuccessMessage,
    ...UserSuccessMessage,
}