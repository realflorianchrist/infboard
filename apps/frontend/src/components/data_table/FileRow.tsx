import DataContextMenu from "@/src/components/menus/DataContextMenu";
import DnDTableRow from "@/src/components/dnd/DnDTableRow";
import {FileMeta} from "@workspace/types";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {useDownloadFile} from "@/src/hooks/useDownloadFile";
import {useGetFolderDataById} from "@/src/api/hooks/api_hooks/folderHooks";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import {TableRow} from "@workspace/ui/components/table";


type FileRow = React.ComponentProps<"tr"> & {
    file: FileMeta
};

export default function FileRow({file, ...props}: FileRow) {

    const {
        openDeleteFileModal,
        isSelected,
        addSelected,
        openEditFileModal,
        openFileVersionHistoryModal,
    } = useContextMenu();

    const {downloadFile} = useDownloadFile();

    const {folderId} = useFolderPath();
    const {data: result} = useGetFolderDataById(folderId);

    return (
        <DataContextMenu
            {...(!file.deleted && {
                onEdit: () => openEditFileModal(file.id, file.name, file.parentFolderId),
                onDelete: () => openDeleteFileModal(file.id),
            })}
            {...(file.deleted && {
                onUnDelete: () => console.log('undelete'),
            })}
            onShowHistory={() => openFileVersionHistoryModal()}
            onSelect={() => {
                const fileToSelect = result?.folder.files?.find(f => f.id === file.id);
                if (!isSelected(file.id) && fileToSelect) addSelected(fileToSelect);
            }}
        >
            {file.deleted ? (
                <TableRow
                    {...props}
                    onDoubleClick={() => downloadFile(file.id)}
                />
            ) : (
                <DnDTableRow
                    {...props}
                    data={file}
                    onDoubleClick={() => downloadFile(file.id)}
                />
            )}
        </DataContextMenu>
    );
}