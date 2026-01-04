'use client'
import Treeview from "@/src/components/treeview/Treeview";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@workspace/ui/components/resizable";
import {FolderPathCrumbs} from "@/src/components/FolderPathCrumbs";
import DataTable from "@/src/components/data_table/DataTable";
import DataContextMenu from "@/src/components/menus/DataContextMenu";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import Toolbox from "@/src/components/menus/Toolbox";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import ModalAnchor from "@/src/components/modals/ModalAnchor";
import {DndContext, pointerWithin} from "@dnd-kit/core";
import DataDragOverlay from "@/src/components/dnd/DataDragOverlay";
import useDragAndDropSettings from "@/src/hooks/useDnDSettings";
import {usePersistScroll} from "@/src/hooks/usePersistScroll";

export default function FolderPage() {

    const {path} = useFolderPath();

    const {
        openNewFolderModal,
        openUploadFileModal,
    } = useContextMenu();

    const {
        sensors,
        handleDragStart,
        handleDragEnd,
    } = useDragAndDropSettings();

    const persistScroll = usePersistScroll('tree-scroll');

    return (
        <DndContext
            collisionDetection={pointerWithin}
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <ModalAnchor/>
            <DataDragOverlay/>

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
                        <div
                            className={'h-full overflow-auto scrollbar-gutter-stable'}
                            {...persistScroll}
                        >
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
        </DndContext>
    );
}
