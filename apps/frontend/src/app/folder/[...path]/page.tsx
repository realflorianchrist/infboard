'use client'
import Treeview from "@/src/components/treeview/Treeview";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@workspace/ui/components/resizable";
import {FolderPathCrumbs} from "@/src/components/FolderPathCrumbs";
import DataTable, {RowData} from "@/src/components/data_table/DataTable";
import DataContextMenu from "@/src/components/menus/DataContextMenu";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import Toolbox from "@/src/components/menus/Toolbox";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import ModalAnchor from "@/src/components/modals/ModalAnchor";
import {DndContext, DragEndEvent, DragStartEvent} from "@dnd-kit/core";
import DataDragOverlay from "@/src/components/dnd/DataDragOverlay";
import {useState} from "react";
import {useUpdateFile} from "@/src/api/hooks/api_hooks/fileHooks";
import {useUpdateFolder} from "@/src/api/hooks/api_hooks/folderHooks";
import {UpdateFileMeta, UpdateFolder} from "@workspace/types/data";
import {useQueryClient} from "@tanstack/react-query";
import {ApiRoutes} from "@workspace/routes/apiRoutes";
import {ROOT_FOLDER_ID} from "@workspace/constants/index";
import {isDnDType} from "@/src/types/DragAndDrop";

export default function FolderPage() {
    const [activeRow, setActiveRow] = useState<RowData | null>(null);

    const {
        openNewFolderModal,
        openUploadFileModal,
    } = useContextMenu();

    const {path} = useFolderPath();

    const queryClient = useQueryClient();
    const updateFolder = useUpdateFolder();
    const updateFile = useUpdateFile();

    const handleDragStart = (event: DragStartEvent) => {
        const {active} = event;
        if (!active) return;

        if (isDnDType(active.data.current)) {
            setActiveRow(active.data.current);
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;

        if (!active || !over) {
            setActiveRow(null);
            return;
        }

        const draggedId = active.id as string;
        const targetFolderId = (over.id as string).split('-')[0];

        if (draggedId && targetFolderId
            && draggedId !== targetFolderId
            && isDnDType(active.data.current)
        ) {
            const dragData = active.data.current;

            if (dragData.type === "folder") {
                const folder: UpdateFolder = {
                    id: draggedId,
                    parentFolderId: targetFolderId
                }

                updateFolder.mutate({folder}, {
                    onSuccess: async () => {
                        await queryClient.invalidateQueries({
                            queryKey: [
                                `${ApiRoutes.folders.base}${ApiRoutes.folders.byId(dragData.parentFolderId ?? ROOT_FOLDER_ID)}`
                            ]})
                    }
                });

            } else if (dragData.type === "file") {
                const file: UpdateFileMeta = {
                    id: draggedId,
                    parentFolderId: targetFolderId
                }

                updateFile.mutate({file});
            }
        }

        setActiveRow(null);
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className={'mb-4 flex items-center w-full justify-between'}>
                <FolderPathCrumbs withLinks={true}/>
                <div className={'right-0 relative'}>
                    <Toolbox/>
                </div>
            </div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize={15}
                    minSize={15}
                    maxSize={25}
                    className={'h-full'}
                >
                    <DataContextMenu
                        onNewFolder={() => openNewFolderModal()}
                        onUploadFile={() => openUploadFileModal()}
                    >
                        <div className={'h-full overflow-auto'}>
                            <Treeview/>
                        </div>
                    </DataContextMenu>
                </ResizablePanel>
                <ResizableHandle/>
                <ResizablePanel
                    defaultSize={85}
                    className={'h-full'}
                >
                    <DataContextMenu
                        onNewFolder={() => openNewFolderModal(path[path.length - 1]?.id)}
                        onUploadFile={() => openUploadFileModal(path[path.length - 1]?.id)}
                    >
                        <div className={'flex h-full pl-4 overflow-auto'}>
                            <DataTable/>
                        </div>
                    </DataContextMenu>
                </ResizablePanel>
            </ResizablePanelGroup>
            <ModalAnchor/>

            <DataDragOverlay rowData={activeRow}/>

        </DndContext>
    );
}
