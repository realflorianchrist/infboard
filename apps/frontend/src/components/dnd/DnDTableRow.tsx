import React from "react";
import {useDraggable, useDroppable,} from "@dnd-kit/core";
import {TableRow} from "@workspace/ui/components/table";
import {cn} from "@workspace/ui/lib/utils";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {useIsDraggingGlobally} from "@/src/hooks/useIsDraggingGlobally";
import {Data, isFolder} from "@workspace/types";

type DraggableDroppableTableRowProps = React.ComponentProps<"tr"> & {
    data: Data;
};

export default function DnDTableRow({className, data, ...props}: DraggableDroppableTableRowProps) {

    const isDraggingGlobally = useIsDraggingGlobally();

    const {attributes, listeners, setNodeRef: setDraggableRef, isDragging, active} = useDraggable({id: data.id, data});
    const {isOver, setNodeRef: setDroppableRef, node: dropNode} = useDroppable({id: data.id});

    const {isSelected} = useContextMenu();

    const isFolderBeingDragged = isDragging || (isDraggingGlobally && isSelected(data.id));
    const canDrop = isOver
        && (active?.id as string).split('-')[0] !== dropNode.current?.id.split('-')[0]
        && !isSelected(data.id);

    return (
        <TableRow
            {...props}
            id={data.id}
            ref={(node) => {
                setDraggableRef(node);
                if (isFolder(data)) {
                    setDroppableRef(node);
                }
            }}
            className={cn(
                className,
                isFolderBeingDragged && "opacity-50",
                canDrop && "bg-accent/20 outline outline-accent outline-dashed"
            )}
            {...attributes}
            {...listeners}
        />
    );
}
