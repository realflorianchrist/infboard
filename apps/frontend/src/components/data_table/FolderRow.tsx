import DataContextMenu from "@/src/components/menus/DataContextMenu";
import DnDTableRow from "@/src/components/dnd/DnDTableRow";
import {ErrorType, Folder} from "@workspace/types";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import {useGetFolderDataById, useUpdateFolder} from "@/src/api/hooks/api_hooks/folderHooks";
import {TableRow} from "@workspace/ui/components/table";
import {toast} from "sonner";
import {successMessage} from "@/src/utils/getSuccessMessage";
import {getErrorMessage} from "@/src/utils/getErrorMessage";


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
        openFolderVersionHistoryModal,
    } = useContextMenu();

    const {folderId} = useFolderPath();
    const {data: result} = useGetFolderDataById(folderId);

    const updateFile = useUpdateFolder();

    const unDeleteFolder = (folderId: string) => {
        updateFile.mutate({folder: {id: folderId, deleted: false}}, {
            onSuccess: () => {
                toast.success(successMessage.FOLDER_UNDELETED);
            },
            onError: (e) => {
                const messages: string[] = [];
                if (e.errorType === ErrorType.VALIDATION_ERROR) {
                    e.validationErrors?.forEach((error) => {
                        messages.push(getErrorMessage(error));
                    });
                } else {
                    messages.push(getErrorMessage(e.errorType));
                }
                messages.forEach(m => toast.error(m));
            },
        });
    };

    return (
        <DataContextMenu
            {...(!folder.deleted && {
                onNewFolder: () => openNewFolderModal(folder.id),
                onUploadFile: () => openUploadFileModal(folder.id),
                onEdit: () => openRenameFolderModal(folder.id, folder.name, folder.parentFolderId),
                onDelete: () => openDeleteFolderModal(folder.id),
            })}
            {...(folder.deleted && {
                onUnDelete: () => unDeleteFolder(folder.id),
            })}
            onShowHistory={() => openFolderVersionHistoryModal()}
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