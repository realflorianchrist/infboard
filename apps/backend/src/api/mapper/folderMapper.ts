import { FolderDocument } from "@src/models/Folder";
import { Folder } from "@workspace/types";

export const folderDocumentToFolderMapper = (folderDocument: FolderDocument): Folder => {
    return {
        id: folderDocument.id,
        name: folderDocument.name,
        parentFolderId: folderDocument.parentFolderId,
        deleted: folderDocument.deleted,
        version: folderDocument.version,
        updatedAt: folderDocument.updatedAt,
        userName: folderDocument.userName,
    };
};