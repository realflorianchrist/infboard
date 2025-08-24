import {FolderDocument} from "@src/models/Folder";
import {Folder} from "@workspace/types";

export const folderDocumentToFolderMapper = (folderDocument: FolderDocument): Folder => {
    return {
        id: folderDocument._id.toString(),
        name: folderDocument.name,
        parentFolderId: folderDocument.parentFolderId?.toString(),
    }
}