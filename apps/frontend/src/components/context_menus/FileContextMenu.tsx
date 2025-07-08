'use client';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@workspace/ui/components/context-menu';
import {ReactNode} from 'react';

type FileContextMenuProps = {
    children: ReactNode;
    onRename?: () => void;
    onDelete?: () => void;
};

export default function FileContextMenu({ children, onRename, onDelete }: FileContextMenuProps) {
    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                <ContextMenuItem onClick={onRename}>Umbenennen</ContextMenuItem>
                <ContextMenuItem onClick={onDelete}>Löschen</ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}
