import DataContextMenu from "@/src/components/menus/DataContextMenu";
import DnDTableRow from "@/src/components/dnd/DnDTableRow";
import {Folder} from "@workspace/types";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import {useGetFolderDataById} from "@/src/api/hooks/api_hooks/folderHooks";
import {TableRow} from "@workspace/ui/components/table";


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
            {...(!folder.deleted && {
                onNewFolder: () => openNewFolderModal(folder.id),
                onUploadFile: () => openUploadFileModal(folder.id),
                onEdit: () => openRenameFolderModal(folder.id, folder.name, folder.parentFolderId),
                onDelete: () => openDeleteFolderModal(folder.id),
            })}
            {...(folder.deleted && {
                onUnDelete: () => console.log('undelete'),
            })}
            onShowHistory={() => console.log('show history')}
            onSelect={() => {
                const folderToSelect = result?.folder.children?.find(f => f.id === folder.id);
                if (!isSelected(folder.id) && folderToSelect) addSelected(folderToSelect);
            }}
        >
            {folder.deleted ? (
                <TableRow
                    {...props}
                />
            ) : (
                <DnDTableRow
                    {...props}
                    data={folder}
                    onDoubleClick={() => {
                        pushFolderById(folder.id);
                        setSelected([]);
                    }}
                />
            )}
        </DataContextMenu>
    );
}