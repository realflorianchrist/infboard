import {FolderDocument, FolderModel, FolderSnapshot} from "@src/models/Folder";
import {Folder} from "@workspace/types";
import {FileDocument, FileModel, FileSnapshot} from "@src/models/File";
import {folderDocumentToFolderMapper} from "@src/api/mapper/folderMapper";
import {fileDocumentToFileMapper} from "@src/api/mapper/fileMapper";
import {ROOT_FOLDER_ID} from "@workspace/constants";


export const getFolderTree = async (): Promise<Folder[]> => {
    const flatFolders = await FolderModel.find().sort({name: 1}).lean({virtuals: true});

    const folderMap = new Map<string, Folder>();

    for (const f of flatFolders) {
        folderMap.set(f.id, {
            id: f.id,
            name: f.name,
            parentFolderId: f.parentFolderId,
            children: [],
            files: [],
            deleted: f.deleted
        });
    }

    const roots: Folder[] = [];

    for (const f of flatFolders) {
        const current = folderMap.get(f.id);
        if (!current) continue;

        const parentId = f.parentFolderId;
        if (parentId && folderMap.has(parentId)) {
            const parent = folderMap.get(parentId)!;
            parent.children?.push(current);
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
            FolderModel.find({parentFolderId: parentId}).setOptions(findOpts ?? {}).sort({name: 1}).lean({virtuals: true}),
            FileModel.find({parentFolderId: parentId}).setOptions(findOpts ?? {}).sort({name: 1}).lean({virtuals: true}),
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

    const folderDoc = await FolderModel.findById(folderId).setOptions(findOpts ?? {}).lean({virtuals: true});
    if (!folderDoc) return null;

    const {subfolders, files} = await listChildren(folderId);

    return {
        id: folderDoc.id,
        name: folderDoc.name,
        children: subfolders,
        files,
        deleted: folderDoc.deleted
    };
};

export const createFileSnapshot = (
    file: FileDocument,
    options: {
        updatedBy: string;
        reason?: "create" | "update" | "restore";
        restoreFromVersion?: number;
    }
): FileSnapshot => {
    return {
        version: file.version,
        createdAt: new Date(),
        updatedBy: options.updatedBy,
        reason: options.reason,
        restoreFromVersion: options.restoreFromVersion,

        state: {
            name: file.name,
            contentType: file.contentType,
            size: file.size,
            userName: file.userName,
            parentFolderId: file.parentFolderId,
            comment: file.comment,
            deleted: file.deleted,
            s3Key: file.s3Key,
        },
    };
};


export const createFolderSnapshot = (
    folder: FolderDocument,
    options: {
        updatedBy: string;
        reason?: "create" | "update" | "restore";
        restoreFromVersion?: number;
    }
): FolderSnapshot => {
    return {
        version: folder.version,
        createdAt: new Date(),
        updatedBy: options.updatedBy,
        reason: options.reason,
        restoreFromVersion: options.restoreFromVersion,

        state: {
            name: folder.name,
            parentFolderId: folder.parentFolderId,
            userName: folder.userName,
            deleted: folder.deleted,
        },
    };
};