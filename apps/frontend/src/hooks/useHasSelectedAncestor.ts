import {useMemo} from "react";
import {Folder} from "@workspace/types/src/data";
import {FolderPath} from "@workspace/types/src/folderPath";
import {useGetAllFolders} from "@/src/api/hooks/api_hooks/folderHooks";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";

export const useHasSelectedAncestor = () => {
    const {data} = useGetAllFolders();
    const {selected} = useContextMenu();

    const ancestorMap = useMemo(() => {
        if (!data?.folders || selected.length === 0) return new Map<string, boolean>();

        const selectedIds = new Set(selected.map((item) => item.id));
        const map = new Map<string, boolean>();

        const flatten = (folders: Folder[], path: FolderPath = []) => {
            for (const folder of folders) {
                const currentPath = [...path, {id: folder.id, name: folder.name}];
                const hasAncestor = currentPath
                    .slice(0, -1)
                    .some((p) => selectedIds.has(p.id));

                map.set(folder.id, hasAncestor);

                if (folder.children) {
                    flatten(folder.children, currentPath);
                }
            }
        };

        flatten(data.folders);
        return map;
    }, [data, selected]);

    return {
        hasSelectedAncestor: (folderId: string) => ancestorMap.get(folderId) ?? false
    }
}
