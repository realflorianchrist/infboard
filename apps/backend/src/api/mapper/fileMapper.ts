import {FileDocument} from "@src/models/File";
import {FileMeta} from "@workspace/types/data";

export const fileDocumentToFileMapper = (fileDocument: FileDocument): FileMeta => {
    return {
        id: fileDocument._id.toString(),
        url: fileDocument.url ?? '',
        contentType: fileDocument.contentType,
        name: fileDocument.name,
        version: fileDocument.version,
        size: fileDocument.size,
        updatedAt: fileDocument.updatedAt,
        userName: fileDocument.userName,
        meta: fileDocument.meta,
        comment: fileDocument.comment,
        downloads: fileDocument.downloads,
    }
}