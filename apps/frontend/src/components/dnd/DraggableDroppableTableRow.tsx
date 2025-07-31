import React from "react";
import {useDraggable, useDroppable,} from "@dnd-kit/core";
import {TableRow} from "@workspace/ui/components/table";
import {cn} from "@workspace/ui/lib/utils";
import {RowData} from "@/src/components/data_table/DataTable";

type DraggableDroppableTableRowProps = React.ComponentProps<"tr"> & {
    id: string;
    data: RowData;
};

export default function DraggableDroppableTableRow({id, className, data, ...props}: DraggableDroppableTableRowProps) {

    const {attributes, listeners, setNodeRef: setDraggableRef, isDragging, active} = useDraggable({id, data});
    const {isOver, setNodeRef: setDroppableRef, node: dropNode} = useDroppable({id});

    return (
        <TableRow
            {...props}
            id={id}
            ref={(node) => {
                setDraggableRef(node);
                if (data.type === "folder") {
                    setDroppableRef(node);
                }
            }}
            className={cn(className,
                `${isDragging && "opacity-50"}`,
                `${isOver && active?.id !== dropNode.current?.id 
                && "bg-accent/20 outline outline-accent outline-dashed"}`
            )}
            {...attributes}
            {...listeners}
        />
    );
}
