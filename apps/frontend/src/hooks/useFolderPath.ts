import {usePathname, useRouter} from 'next/navigation';
import {Folder, FolderPath} from '@workspace/types';
import {useGetAllFolders} from "@/src/api/hooks/api_hooks/folderHooks";
import routes from "@/src/constants/routes";
import findFolderPathById from "@/src/utils/findFolderPathById";
import {ROOT_FOLDER_ID} from "@workspace/constants";

export const useFolderPath = () => {
    const pathname = usePathname();
    const router = useRouter();
    const {data: folderTree} = useGetAllFolders();

    if (!folderTree) {
        return {
            path: [],
            setPath: () => {},
            pushFolderById: () => {},
            popFolder: () => {},
            resetPath: () => {},
            folderId: ROOT_FOLDER_ID,
        };
    }

    const resolvePathSegments = (folders: Folder[], paths: string[]): FolderPath => {
        let currentLevel = folders;
        const resolved: FolderPath = [];

        for (const name of paths) {
            const match = currentLevel.find(f => f.name === name);
            if (!match) break;
            resolved.push({id: match.id, name: match.name});
            currentLevel = match.children ?? [];
        }

        return resolved;
    };

    const serializePathToUrl = (folderPath: FolderPath) => {
        return '/folder/' + folderPath.map(f => encodeURIComponent(f.name)).join('/');
    };

    const path: FolderPath = folderTree
        ? resolvePathSegments(folderTree.folders,
            pathname
                .replace('/folder/', '')
                .split('/')
                .map(decodeURIComponent)
        )
        : [];

    const setPath = (newPath: FolderPath) => {
        router.push(serializePathToUrl(newPath));
    };

    const pushFolderById = (id: string) => {
        const fullPath = findFolderPathById(folderTree.folders, id);
        if (!fullPath) return;
        setPath(fullPath);
    };

    const popFolder = () => {
        setPath(path.slice(0, -1));
    };

    const resetPath = () => {
        router.push(routes.HOME);
    };

    const getFolderId = () => path[path.length - 1]?.id ?? ROOT_FOLDER_ID;

    return {
        path,
        setPath,
        pushFolderById,
        popFolder,
        resetPath,
        folderId: getFolderId(),
    };
};
