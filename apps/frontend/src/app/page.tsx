'use client'
import Treeview from "@/src/components/treeview/Treeview";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@workspace/ui/components/resizable";
import FolderPath from "@/src/components/FolderPath";
import DataTable from "@/src/components/data_table/DataTable";


export default function Home() {
    return (
        <main className={'flex flex-col'}>
            <div className={'mb-4'}>
                <FolderPath/>
            </div>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={15}>
                    <Treeview/>
                </ResizablePanel>
                <ResizableHandle/>
                <ResizablePanel>
                    <div className={'p-2'}>
                        <DataTable/>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
}
