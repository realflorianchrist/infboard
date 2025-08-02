enum FolderSuccessMessage {
    FOLDER_CREATED = "Ordner erfolgreich erstellt.",
    FOLDER_MOVED = "Ordner erfolgreich verschoben.",
}

enum FileSuccessMessage {
    FILE_UPLOADED = "Datei erfolgreich hochgeladen.",
    FILE_MOVED = "Datei erfolgreich verschoben.",
}

enum UserSuccessMessage {
    LOGIN_SUCCESSFUL = "Login erfolgreich",
    REGISTER_SUCCESSFUL = "Registrierung erfolgreich",
}

export const SuccessMessage = {
    ...FolderSuccessMessage,
    ...FileSuccessMessage,
    ...UserSuccessMessage,
}