import {FolderDocument, FolderModel, FolderVersion, IUpdateFolder} from "@src/models/Folder";
import {Folder} from "@workspace/types";
import {FileDocument, FileModel, FileVersion, IUpdateFile} from "@src/models/File";
import {folderDocumentToFolderMapper} from "@src/api/mapper/folderMapper";
import {fileDocumentToFileMapper} from "@src/api/mapper/fileMapper";
import {ROOT_FOLDER_ID} from "@workspace/constants";


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

const checkForUpdate = <T>(oldValue: T | undefined, newValue: T | undefined): T | undefined => {
    return newValue != null && newValue !== oldValue
        ? oldValue
        : undefined;
};

export const createFileVersion = (file: FileDocument, update: IUpdateFile): FileVersion => {
    return {
        version: file.version,
        name: checkForUpdate(file.name, update.name),
        contentType: checkForUpdate(file.contentType, update.contentType),
        size: checkForUpdate(file.size, update.size),
        updatedAt: file.updatedAt,
        userName: file.userName,
        parentFolderId: checkForUpdate(file.parentFolderId, update.parentFolderId),
        comment: checkForUpdate(file.comment, update.comment),
        deleted: checkForUpdate(file.deleted, update.deleted),
        s3Key: checkForUpdate(file.s3Key, update.s3Key)
    };
};

export const createFolderVersion = (folder: FolderDocument, update: IUpdateFolder): FolderVersion => {
    return {
        version: folder.version,
        name: checkForUpdate(folder.name, update.name),
        updatedAt: folder.updatedAt,
        userName: folder.userName,
        parentFolderId: checkForUpdate(folder.parentFolderId, update.parentFolderId),
        deleted: checkForUpdate(folder.deleted, update.deleted),
    };
};