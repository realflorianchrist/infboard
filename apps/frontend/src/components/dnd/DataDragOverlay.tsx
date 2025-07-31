import {snapCenterToCursor} from "@dnd-kit/modifiers";
import {DragOverlay} from "@dnd-kit/core";
import { RowData } from "../data_table/DataTable";
import {IoFolderOutline} from "react-icons/io5";
import {getFileSymbol} from "@/src/utils/getFileSymbol";

type Props = {
    rowData: RowData | null;
};

export default function DataDragOverlay({rowData}: Props) {

    return (
        <DragOverlay modifiers={[snapCenterToCursor]}>
            <div className="flex items-center gap-2 w-fit select-none text-sm">
                <span className="shrink-0">
                    {rowData?.type === 'folder' ? <IoFolderOutline/> : getFileSymbol(rowData?.contentType)}
                </span>
                <span>{rowData?.name}</span>
            </div>
        </DragOverlay>
    );
};
