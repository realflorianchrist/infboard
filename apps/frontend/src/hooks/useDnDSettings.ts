import {DragEndEvent, DragStartEvent, MouseSensor, useSensor, useSensors} from "@dnd-kit/core";
import {useQueryClient} from "@tanstack/react-query";
import {useUpdateFolder} from "@/src/api/hooks/api_hooks/folderHooks";
import {useUpdateFile} from "@/src/api/hooks/api_hooks/fileHooks";
import {isData, isFileMeta, isFolder, UpdateFileMeta, UpdateFolder} from "@workspace/types/data";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {ROOT_FOLDER_ID} from "@workspace/constants/index";
import {toast} from "sonner";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import {ErrorType} from "@workspace/types/apiResponses";
import {SuccessMessage} from "@/src/utils/getSuccessMessage";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";

const useDragAndDropSettings = () => {

    const {isSelected, selected, setSelected} = useContextMenu();

    const queryClient = useQueryClient();
    const updateFolder = useUpdateFolder();
    const updateFile = useUpdateFile();

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 5,
        },
    });

    const sensors = useSensors(
        mouseSensor,
    );

    const handleDragStart = (event: DragStartEvent) => {
        const {active} = event;
        if (!active) return;

        if (isData(active.data.current) && selected.length === 0) {
            setSelected([active.data.current]);
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (!active || !over) {
            setSelected([]);
            return;
        }

        const targetFolderId = (over.id as string).split('-')[0];

        if (targetFolderId && !selected.some(f => f.id === targetFolderId || f.parentFolderId === targetFolderId)) {

            selected.forEach((item) => {

                if (isFolder(item)) {

                    console.log(`folder: ${item.name}`);

                } else if (isFileMeta(item)) {

                    console.log(`file: ${item.name}`);
                }
            })


            // if (dragData.type === "folder") {
            //     const folder: UpdateFolder = {
            //         id: draggedId,
            //         parentFolderId: targetFolderId
            //     }
            //
            //     updateFolder.mutate({folder}, {
            //         onSuccess: async () => {
            //             toast.success(SuccessMessage.FOLDER_MOVED);
            //             await queryClient.invalidateQueries({
            //                 queryKey: [
            //                     `${ApiRoutes.folders.base}${ApiRoutes.folders.byId(dragData.parentFolderId ?? ROOT_FOLDER_ID)}`
            //                 ]
            //             })
            //         },
            //         onError: (e) => {
            //             if (e.errorType === ErrorType.VALIDATION_ERROR) {
            //                 e.validationErrors?.forEach((error) => {
            //                     toast.error(getErrorMessage(error));
            //                 });
            //             } else {
            //                 toast.error(getErrorMessage(e.errorType));
            //             }
            //         }
            //     });
            //
            // } else if (dragData.type === "file") {
            //     const file: UpdateFileMeta = {
            //         id: draggedId,
            //         parentFolderId: targetFolderId
            //     }
            //
            //     updateFile.mutate({file}, {
            //         onSuccess: async () => {
            //             toast.success(SuccessMessage.FILE_MOVED);
            //             await queryClient.invalidateQueries({
            //                 queryKey: [
            //                     `${ApiRoutes.folders.base}${ApiRoutes.folders.byId(dragData.parentFolderId ?? ROOT_FOLDER_ID)}`
            //                 ]
            //             })
            //         },
            //         onError: (e) => {
            //             if (e.errorType === ErrorType.VALIDATION_ERROR) {
            //                 e.validationErrors?.forEach((error) => {
            //                     toast.error(getErrorMessage(error));
            //                 });
            //             } else {
            //                 toast.error(getErrorMessage(e.errorType));
            //             }
            //         }
            //     });
            // }
        }

        setSelected([]);
    }

    return {
        sensors,
        handleDragStart,
        handleDragEnd,
    }
}

export default useDragAndDropSettings;