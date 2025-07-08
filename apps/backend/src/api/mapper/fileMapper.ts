import {FileDocument} from "@src/models/File";
import {File} from "@workspace/types/data";

export const fileDocumentToFileMapper = (fileDocument: FileDocument): File => {
    return {
        id: fileDocument._id.toString(),
        url: fileDocument.url,
        name: fileDocument.name,
        version: fileDocument.version,
        extension: fileDocument.extension,
        size: fileDocument.size,
        updatedAt: fileDocument.updatedAt,
        userName: fileDocument.userName,
        meta: fileDocument.meta,
        comment: fileDocument.comment,
        downloads: fileDocument.downloads,
    }
}