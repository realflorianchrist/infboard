import {Folder} from "@workspace/types/data";
import {FolderPath} from "@workspace/types/folderPath";

const findFolderPathById = (
    folders?: Folder[] | null,
    id?: string | null,
    path: FolderPath = []
): FolderPath | null => {
    if (!folders || !id) return null;

    for (const folder of folders) {
        const currentPath = [...path, {id: folder.id, name: folder.name}];
        if (folder.id === id) return currentPath;

        const result = findFolderPathById(folder.children ?? [], id, currentPath);
        if (result) return result;
    }
    return null;
};

export default findFolderPathById;