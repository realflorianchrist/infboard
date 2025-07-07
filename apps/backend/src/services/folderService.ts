import { FolderModel } from "@src/models/Folder";
import { Folder } from "@workspace/types/data";

export const getFolderTree = async (): Promise<Folder[]> => {
    const flatFolders = await FolderModel.find().lean();

    const folderMap = new Map<string, Folder & { children: Folder[] }>();

    for (const f of flatFolders) {
        folderMap.set(f._id.toString(), {
            id: f._id.toString(),
            name: f.name,
            children: [],
            files: [],
        });
    }

    const roots: Folder[] = [];

    for (const f of flatFolders) {
        const current = folderMap.get(f._id.toString());
        if (!current) continue;

        const parentId = f.parentId?.toString();
        if (parentId && folderMap.has(parentId)) {
            const parent = folderMap.get(parentId)!;
            parent.children.push(current);
        } else {
            roots.push(current);
        }
    }

    return roots;
};
