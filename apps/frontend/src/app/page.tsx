'use client'
import Treeview from "@/src/components/treeview/Treeview";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@workspace/ui/components/resizable";
import {FolderPathCrumbs} from "@/src/components/FolderPathCrumbs";
import DataTable from "@/src/components/data_table/DataTable";
import {ScrollArea} from "@workspace/ui/components/scroll-area";
import DataContextMenu from "@/src/components/context_menus/DataContextMenu";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {useFolderPath} from "@/src/providers/FolderPathProvider";


export default function Home() {
    const {
        openNewFolderModal,
        openUploadFileModal,
    } = useContextMenu();

    const {path} = useFolderPath();

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
        </>
    );
}
