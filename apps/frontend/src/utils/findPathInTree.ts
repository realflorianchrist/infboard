import {Folder} from "@workspace/types/data";
import {FolderPath} from "@workspace/types/folderPath";

const findPathInTree = (tree: Folder[] | null, targetId?: string): FolderPath | null => {
    if (!tree || !targetId) return null;

    for (const node of tree) {
        if (node.id === targetId) {
            return [{id: node.id, name: node.name}];
        }

        if (node.children && node.children.length > 0) {
            const childPath = findPathInTree(node.children, targetId);
            if (childPath) {
                return [{id: node.id, name: node.name}, ...childPath];
            }
        }
    }

    return null;
}

export default findPathInTree;