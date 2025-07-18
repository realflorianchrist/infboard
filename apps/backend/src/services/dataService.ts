import {FolderModel} from "@src/models/Folder";
import {Folder} from "@workspace/types/data";
import {FileModel} from "@src/models/File";
import {folderDocumentToFolderMapper} from "@src/api/mapper/folderMapper";
import {fileDocumentToFileMapper} from "@src/api/mapper/fileMapper";
import {ROOT_FOLDER_ID} from "@workspace/constants/index";

export const getFolderTree = async (): Promise<Folder[]> => {
    const flatFolders = await FolderModel.find().lean();

    const folderMap = new Map<string, Folder & { children: Folder[] }>();

    for (const f of flatFolders) {
        folderMap.set(f._id.toString(), {
            id: f._id.toString(),
            name: f.name,
            parentFolderId: f.parentFolderId?.toString(),
            children: [],
            files: [],
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

export const getFolderContents = async (folderId: string): Promise<Folder | null> => {
    if (folderId === ROOT_FOLDER_ID) {
        const [subfolderDocs, fileDocs] = await Promise.all([
            FolderModel.find({ parentFolderId: ROOT_FOLDER_ID }).lean(),
            FileModel.find({ parentFolderId: ROOT_FOLDER_ID }).lean(),
        ]);

        const subfolders = subfolderDocs.map(folderDocumentToFolderMapper);
        const files = fileDocs.map(f => fileDocumentToFileMapper(f));

        return {
            id: ROOT_FOLDER_ID,
            name: ROOT_FOLDER_ID,
            children: subfolders,
            files: files,
        };
    }

    const folderDoc = await FolderModel.findById(folderId).lean();
    if (!folderDoc) return null;

    const [subfolderDocs, fileDocs] = await Promise.all([
        FolderModel.find({ parentFolderId: folderId }).lean(),
        FileModel.find({ parentFolderId: folderId }).lean(),
    ]);

    const subfolders = subfolderDocs.map(folderDocumentToFolderMapper);
    const files = fileDocs.map(f => fileDocumentToFileMapper(f));

    return {
        id: folderDoc.id.toString(),
        name: folderDoc.name,
        children: subfolders,
        files: files,
    };
};
