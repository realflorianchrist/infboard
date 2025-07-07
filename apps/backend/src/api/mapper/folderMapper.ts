import {FolderDocument, IFolder} from "@src/models/Folder";
import {Folder} from "@workspace/types/data";

export const iFolderToFolderMapper = (folder: IFolder): Folder => {
    return {
        id: folder.id!,
        name: folder.name,
        children: folder.children
            ? (folder.children as IFolder[]).map(iFolderToFolderMapper)
            : [],
    };
};