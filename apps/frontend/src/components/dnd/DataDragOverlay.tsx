import {snapCenterToCursor} from "@dnd-kit/modifiers";
import {DragOverlay} from "@dnd-kit/core";
import {IoFolderOutline} from "react-icons/io5";
import {getFileSymbol} from "@/src/utils/getFileSymbol";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {isFolder} from "@workspace/types/src/data";

type Props = {
};


export default function DataDragOverlay({}: Props) {

    const {isSelectMode, selected} = useContextMenu();

    if (selected.length === 0) return null;

    return (
        <DragOverlay
            modifiers={[snapCenterToCursor]}
            dropAnimation={null}
        >
            <div
                className="flex items-center gap-2 w-fit pointer-events-none select-none text-sm bg-border rounded-full px-3 py-1">
                {isSelectMode && selected.length > 1 ? (
                    <>
                        <span>{selected.length} Elemente</span>
                    </>
                ) : (
                    <>
                        <span className="shrink-0">
                            {isFolder(selected[0]) ? <IoFolderOutline/> : getFileSymbol(selected[0]?.contentType)}
                        </span>
                        <span>{selected[0]?.name}</span>
                    </>
                )}
            </div>
        </DragOverlay>
    );
};
