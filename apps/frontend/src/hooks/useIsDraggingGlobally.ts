import {useState} from "react";
import {useDndMonitor} from "@dnd-kit/core";

export const useIsDraggingGlobally = (): boolean => {
    const [isDragging, setIsDragging] = useState(false);

    useDndMonitor({
        onDragStart: () => setIsDragging(true),
        onDragEnd: () => setIsDragging(false),
        onDragCancel: () => setIsDragging(false),
    });

    return isDragging;
}
