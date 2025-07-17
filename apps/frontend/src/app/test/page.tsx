'use client';
import {DndContext, useDraggable} from '@dnd-kit/core';

function Box() {
    const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
        id: 'box',
    });

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={{
                width: 100,
                height: 100,
                backgroundColor: isDragging ? 'green' : 'red',
                transform: transform ? `translate(${transform.x}px, ${transform.y}px)` : undefined,
                cursor: 'grab',
            }}
        >
            Drag me
        </div>
    );
}

export default function DragTestPage() {
    return (
        <div className="p-4">
            <DndContext>
                <Box />
            </DndContext>
        </div>
    );
}
