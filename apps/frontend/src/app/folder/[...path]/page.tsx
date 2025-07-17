'use client'
import Treeview from "@/src/components/treeview/Treeview";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@workspace/ui/components/resizable";
import {FolderPathCrumbs} from "@/src/components/FolderPathCrumbs";
import DataTable from "@/src/components/data_table/DataTable";
import DataContextMenu from "@/src/components/menus/DataContextMenu";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {useFolderPath} from "@/src/providers/FolderPathProvider";
import Toolbox from "@/src/components/menus/Toolbox";
import {DndContext, DragEndEvent} from "@dnd-kit/core";


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
            // todo: handle drop
            console.log(`Move item ${draggedId} to folder ${targetFolderId}`);
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
                        onNewFolder={() => openNewFolderModal(null)}
                        onUploadFile={() => openUploadFileModal(null)}
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
                        onNewFolder={() => openNewFolderModal(path[path.length - 1]?.id ?? null)}
                        onUploadFile={() => openUploadFileModal(path[path.length - 1]?.id ?? null)}
                    >
                        <div className={'flex h-full pl-4 overflow-auto'}>
                            <DataTable/>
                        </div>
                    </DataContextMenu>
                </ResizablePanel>
            </ResizablePanelGroup>
        </DndContext>
    );
}
