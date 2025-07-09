'use client'
import Treeview from "@/src/components/treeview/Treeview";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@workspace/ui/components/resizable";
import {FolderPathCrumbs} from "@/src/components/FolderPathCrumbs";
import DataTable from "@/src/components/data_table/DataTable";
import {ScrollArea} from "@workspace/ui/components/scroll-area";
import DataContextMenu from "@/src/components/context_menus/DataContextMenu";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";


export default function Home() {
    const {
        openNewFolderModal,
        setIsSelectMode,
        openUploadFileModal,
    } = useContextMenu();

    return (
        <>
            <div className={'mb-4'}>
                <FolderPathCrumbs withLinks={true}/>
            </div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize={15}
                    minSize={15}
                    maxSize={25}
                    className={'h-full overflow-hidden'}
                >
                    <DataContextMenu
                        onNewFolder={() => openNewFolderModal(null)}
                        onSelect={() => setIsSelectMode(true)}
                        onUploadFile={() => openUploadFileModal(null)}
                    >
                        <ScrollArea className={'h-full'}>
                            <Treeview/>
                        </ScrollArea>
                    </DataContextMenu>
                </ResizablePanel>
                <ResizableHandle/>
                <ResizablePanel
                    defaultSize={85}
                    className={'h-full overflow-hidden'}
                >
                    <DataContextMenu
                        onNewFolder={() => openNewFolderModal(null)}
                        onSelect={() => setIsSelectMode(true)}
                        onUploadFile={() => openUploadFileModal(null)}
                    >
                        <ScrollArea className={'h-full pl-4'}>
                            <DataTable/>
                        </ScrollArea>
                    </DataContextMenu>
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
}
