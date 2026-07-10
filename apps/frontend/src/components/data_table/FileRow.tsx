import DataContextMenu from "@/src/components/menus/DataContextMenu";
import DnDTableRow from "@/src/components/dnd/DnDTableRow";
import {ErrorType, FileMeta} from "@workspace/types";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {useDownloadFile} from "@/src/hooks/useDownloadFile";
import {useGetFolderDataById} from "@/src/api/hooks/api_hooks/folderHooks";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import {TableRow} from "@workspace/ui/components/table";
import {useUpdateFile} from "@/src/api/hooks/api_hooks/fileHooks";
import {toast} from "sonner";
import {successMessage} from "@/src/utils/getSuccessMessage";
import {getErrorMessage} from "@/src/utils/getErrorMessage";


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

    const updateFile = useUpdateFile();

    const unDeleteFile = (fileId: string) => {
        updateFile.mutate({file: {id: fileId, deleted: false}}, {
            onSuccess: () => {
                toast.success(successMessage.FILE_UNDELETED);
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
            {...(!file.deleted && {
                onEdit: () => openEditFileModal(file.id, file.name, file.parentFolderId),
                onDelete: () => openDeleteFileModal(file.id),
            })}
            {...(file.deleted && {
                onUnDelete: () => unDeleteFile(file.id),
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