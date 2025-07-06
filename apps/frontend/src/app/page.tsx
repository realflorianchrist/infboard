import Grid from "../components/Grid";
import Treeview from "@/src/components/treeview/Treeview";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@workspace/ui/components/resizable";
import FolderPath from "@/src/components/FolderPath";

export default function Home() {
    return (
        <main className={'flex flex-col'}>
            <FolderPath/>
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={15}>
                    <Treeview/>
                </ResizablePanel>
                <ResizableHandle/>
                <ResizablePanel>
                    <div className={'w-full'}>
                        <Grid/>
                    </div>
                </ResizablePanel>
            </ResizablePanelGroup>
        </main>
    );
}
