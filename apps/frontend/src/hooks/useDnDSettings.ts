import {DragEndEvent, DragStartEvent, MouseSensor, useSensor, useSensors} from "@dnd-kit/core";
import {useQueryClient} from "@tanstack/react-query";
import {isData, isFileMeta, isFolder} from "@workspace/types/data";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {ROOT_FOLDER_ID} from "@workspace/constants/index";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {useMoveData} from "@/src/api/hooks/api_hooks/dataHooks";
import {toast} from "sonner";
import {successMessage} from "@/src/utils/getSuccessMessage";
import {ErrorType} from "@workspace/types/apiResponses";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import {useHasSelectedAncestor} from "@/src/hooks/useHasSelectedAncestor";

const useDragAndDropSettings = () => {

    const {isSelected, selected, setSelected} = useContextMenu();
    const {hasSelectedAncestor} = useHasSelectedAncestor();

    const queryClient = useQueryClient();

    const moveData = useMoveData();

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

        const canMove = targetFolderId
            && !hasSelectedAncestor(targetFolderId)
            && selected.every((i) => i.id !== targetFolderId
                && i.parentFolderId !== targetFolderId
                && !hasSelectedAncestor(i.id)
            );

        if (canMove) {

            moveData.mutate({data: selected, targetFolderId}, {
                onSuccess: async () => {
                    toast.success(successMessage.FILES_MOVED);
                },
                onError: (e) => {
                    if (e.errorType === ErrorType.VALIDATION_ERROR) {
                        e.validationErrors?.forEach((error) => {
                            toast.error(getErrorMessage(error));
                        });
                    } else {
                        toast.error(getErrorMessage(e.errorType));
                    }
                }
            });
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