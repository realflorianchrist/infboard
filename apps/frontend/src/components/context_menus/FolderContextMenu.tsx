'use client';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@workspace/ui/components/context-menu';
import {ReactNode} from 'react';

type FolderContextMenuProps = {
    children: ReactNode;
    onRename?: () => void;
    onDelete?: () => void;
};

export default function FolderContextMenu({ children, onRename, onDelete }: FolderContextMenuProps) {
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
