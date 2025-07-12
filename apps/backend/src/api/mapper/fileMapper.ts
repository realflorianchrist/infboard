import {FileDocument} from "@src/models/File";
import {FileMeta} from "@workspace/types/data";

export const fileDocumentToFileMapper = (fileDocument: FileDocument, url?: string): FileMeta => {
    return {
        id: fileDocument._id.toString(),
        contentType: fileDocument.contentType,
        name: fileDocument.name,
        url: url,
        version: fileDocument.version,
        size: fileDocument.size,
        updatedAt: fileDocument.updatedAt,
        userName: fileDocument.userName,
        meta: fileDocument.meta,
        comment: fileDocument.comment,
        downloads: fileDocument.downloads,
    }
}