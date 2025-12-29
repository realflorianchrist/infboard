import {FolderDocument, FolderModel, FolderVersion} from "@src/models/Folder";
import {ErrorType, FileValidationErrorType, Folder, UpdateFileMeta} from "@workspace/types";
import {FileDocument, FileModel, FileVersion, IUpdateFile, UpdateFileSchema} from "@src/models/File";
import {folderDocumentToFolderMapper} from "@src/api/mapper/folderMapper";
import {fileDocumentToFileMapper} from "@src/api/mapper/fileMapper";
import {ROOT_FOLDER_ID} from "@workspace/constants";
import {StatusCodes} from "http-status-codes";
import {ApiError} from "@src/api/utils/apiError";


export const getFolderTree = async (): Promise<Folder[]> => {
    const flatFolders = await FolderModel.find().sort({name: 1}).lean();

    const folderMap = new Map<string, Folder & { children: Folder[] }>();

    for (const f of flatFolders) {
        folderMap.set(f._id.toString(), {
            id: f._id.toString(),
            name: f.name,
            parentFolderId: f.parentFolderId,
            children: [],
            files: [],
            deleted: f.deleted
        });
    }

    const roots: Folder[] = [];

    for (const f of flatFolders) {
        const current = folderMap.get(f._id.toString());
        if (!current) continue;

        const parentId = f.parentFolderId?.toString();
        if (parentId && folderMap.has(parentId)) {
            const parent = folderMap.get(parentId)!;
            parent.children.push(current);
        } else {
            roots.push(current);
        }
    }

    return roots;
};

export const getFolderContents = async (
    folderId: string,
    includeDeleted: boolean
): Promise<Folder | null> => {
    const findOpts = includeDeleted ? {includeDeleted: true} : undefined;

    const listChildren = async (parentId: string) => {
        const [subfolderDocs, fileDocs] = await Promise.all([
            FolderModel.find({parentFolderId: parentId}).setOptions(findOpts ?? {}).sort({name: 1}).lean(),
            FileModel.find({parentFolderId: parentId}).setOptions(findOpts ?? {}).sort({name: 1}).lean(),
        ]);

        return {
            subfolders: subfolderDocs.map(folderDocumentToFolderMapper),
            files: fileDocs.map(f => fileDocumentToFileMapper(f)),
        };
    };

    if (folderId === ROOT_FOLDER_ID) {
        const {subfolders, files} = await listChildren(ROOT_FOLDER_ID);
        return {
            id: ROOT_FOLDER_ID,
            name: ROOT_FOLDER_ID,
            children: subfolders,
            files,
            deleted: false
        };
    }

    const folderDoc = await FolderModel.findById(folderId).setOptions(findOpts ?? {}).lean();
    if (!folderDoc) return null;

    const {subfolders, files} = await listChildren(folderId);

    return {
        id: folderDoc._id.toString(),
        name: folderDoc.name,
        children: subfolders,
        files,
        deleted: folderDoc.deleted
    };
};

export const createFileVersion = (file: FileDocument): FileVersion => {
    return {
        version: file.version ?? 1,
        name: file.name,
        contentType: file.contentType,
        size: file.size,
        updatedAt: file.updatedAt,
        userName: file.userName,
        parentFolderId: file.parentFolderId,
        comment: file.comment,
        deleted: file.deleted,
        s3Key: file.s3Key
    };
};

export const createFolderVersion = (folder: FolderDocument): FolderVersion => {
    return {
        version: folder.version ?? 1,
        name: folder.name,
        updatedAt: folder.updatedAt,
        parentFolderId: folder.parentFolderId,
        deleted: folder.deleted,
    };
};