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
import {DndContext, DragEndEvent, DragOverlay} from "@dnd-kit/core";
import {restrictToWindowEdges, snapCenterToCursor} from '@dnd-kit/modifiers';

export default function FolderPage() {
    const {
        openNewFolderModal,
        openUploadFileModal,
    } = useContextMenu();

    const {path} = useFolderPath();

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (!active || !over) return;

        const draggedId = active.id as string;
        const targetFolderId = over.id as string;

        if (draggedId && targetFolderId && draggedId !== targetFolderId) {
            const dragData = active.data.current as RowData;
            const targetData = over.data.current as RowData;
            // todo: handle drop

            console.log(`drop ${dragData.name} to: ${targetData.name}`);
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
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

            <DragOverlay modifiers={[snapCenterToCursor]}>
                <div className={'position-mouse border border-red-500 w-fit select-none'} >Dragging</div>
            </DragOverlay>

        </DndContext>
    );
}
