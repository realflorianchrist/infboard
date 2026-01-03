import {FileDocument} from "@src/models/File";
import {FileMeta} from "@workspace/types";

export const fileDocumentToFileMapper = (fileDocument: FileDocument, url?: string): FileMeta => {
    return {
        id: fileDocument.id,
        contentType: fileDocument.contentType,
        name: fileDocument.name,
        url: url,
        version: fileDocument.version,
        size: fileDocument.size,
        updatedAt: fileDocument.updatedAt,
        userName: fileDocument.userName,
        comment: fileDocument.comment,
        downloads: fileDocument.downloads,
        parentFolderId: fileDocument.parentFolderId,
        deleted: fileDocument.deleted
    };
};