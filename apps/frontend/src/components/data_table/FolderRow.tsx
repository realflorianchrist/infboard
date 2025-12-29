import DataContextMenu from "@/src/components/menus/DataContextMenu";
import DnDTableRow from "@/src/components/dnd/DnDTableRow";
import {Folder} from "@workspace/types";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import React from "react";
import {useGetFolderDataById} from "@/src/api/hooks/api_hooks/folderHooks";


type FolderRow = React.ComponentProps<"tr"> & {
    folder: Folder
};

export default function FolderRow({folder, ...props}: FolderRow) {

    const {pushFolderById} = useFolderPath();

    const {
        openNewFolderModal,
        openRenameFolderModal,
        openDeleteFolderModal,
        isSelected,
        setSelected,
        addSelected,
        openUploadFileModal,
    } = useContextMenu();

    const {folderId} = useFolderPath();
    const {data: result} = useGetFolderDataById(folderId);

    return (
        <DataContextMenu
            onNewFolder={() => openNewFolderModal(folder.id)}
            onEdit={() => openRenameFolderModal(folder.id, folder.name, folder.parentFolderId)}
            {...(!folder.deleted && {
                onDelete: () => openDeleteFolderModal(folder.id),
            })}
            {...(folder.deleted && {
                onUnDelete: () => console.log('undelete'),
            })}
            onSelect={() => {
                const folderToSelect = result?.folder.children?.find(f => f.id === folder.id);
                if (!isSelected(folder.id) && folderToSelect) addSelected(folderToSelect);
            }}
            onUploadFile={() => openUploadFileModal(folder.id)}
        >
            <DnDTableRow
                {...props}
                data={folder}
                onDoubleClick={() => {
                    pushFolderById(folder.id);
                    setSelected([]);
                }}
            />
        </DataContextMenu>
    );
}