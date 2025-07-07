'use client'
import Treeview from "@/src/components/treeview/Treeview";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@workspace/ui/components/resizable";
import FolderPath from "@/src/components/FolderPath";
import DataTable from "@/src/components/data_table/DataTable";
import {ScrollArea} from "@workspace/ui/components/scroll-area";


export default function Home() {
    return (
        <main>
            <div className={'mb-4'}>
                <FolderPath/>
            </div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel
                    defaultSize={15}
                    minSize={15}
                    maxSize={25}
                    className={'h-full overflow-hidden'}
                >
                    <ScrollArea className={'h-full'}>
                        <Treeview/>
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle/>
                <ResizablePanel
                    defaultSize={85}
                    // minSize={70}
                    // maxSize={90}
                >
                    <div className={'p-2'}>
                        <DataTable/>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
}
