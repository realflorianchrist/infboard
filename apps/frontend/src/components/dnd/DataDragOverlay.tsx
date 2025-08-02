import {snapCenterToCursor} from "@dnd-kit/modifiers";
import {DragOverlay} from "@dnd-kit/core";
import { RowData } from "../data_table/DataTable";
import {IoFolderOutline} from "react-icons/io5";
import {getFileSymbol} from "@/src/utils/getFileSymbol";

type Props = {
    rowData: RowData | null;
};

export default function DataDragOverlay({rowData}: Props) {

    if (!rowData) return null;

    return (
        <DragOverlay
            modifiers={[snapCenterToCursor]}
            dropAnimation={null}
        >
            <div className="flex items-center gap-2 w-fit pointer-events-none select-none text-sm bg-border rounded-full px-3 py-1">
                <span className="shrink-0">
                    {rowData.type === 'folder' ? <IoFolderOutline/> : getFileSymbol(rowData.contentType)}
                </span>
                <span>{rowData.name}</span>
            </div>
        </DragOverlay>
    );
};
