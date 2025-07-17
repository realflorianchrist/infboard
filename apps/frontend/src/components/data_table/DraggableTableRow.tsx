import {useDraggable} from '@dnd-kit/core';
import {TableRow} from "@workspace/ui/components/table";
import {ReactNode, HTMLAttributes, useEffect} from "react";
import {cn} from "@workspace/ui/lib/utils";

interface DraggableTableRowProps extends HTMLAttributes<HTMLTableRowElement> {
    row: {
        id: string;
        original: {
            id: string;
            [key: string]: any;
        };
        [key: string]: any;
    };
    children: ReactNode;
}

export default function DraggableTableRow(
    {
        row,
        children,
        className,
        ...props
    }: DraggableTableRowProps) {

    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: row.original.id,
    });

    useEffect(() => {
        console.log("setNodeRef called for", row.original.id, typeof setNodeRef);
    }, [setNodeRef, row.original.id]);

    return (
        <TableRow
            ref={setNodeRef}
            className={cn("group", className)}
            style={{
                transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
                opacity: isDragging ? 0.5 : 1,
            }}
            {...listeners}
            {...attributes}
            {...props}
        >
            {children}
        </TableRow>
    );
}
