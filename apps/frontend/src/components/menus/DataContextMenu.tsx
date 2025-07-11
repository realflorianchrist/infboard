'use client';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '@workspace/ui/components/context-menu';
import {ReactNode} from 'react';
import menuOptions from "@/src/constants/menuOptions";

type FolderContextMenuProps = {
    children: ReactNode;
    onNewFolder?: () => void;
    onUploadFile?: () => void;
    onRename?: () => void;
    onDelete?: () => void;
    onDownload?: () => void;
    onSelect?: () => void;
    onMove?: () => void;
};

export default function DataContextMenu(
    {
        children,
        onNewFolder,
        onRename,
        onDelete,
        onDownload,
        onSelect,
        onUploadFile,
        onMove,
    }: FolderContextMenuProps) {

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                {children}
            </ContextMenuTrigger>
            <ContextMenuContent>
                {onNewFolder && (
                    <ContextMenuItem onClick={onNewFolder}>
                        {menuOptions.newFolder}
                    </ContextMenuItem>
                )}
                {onUploadFile && (
                    <ContextMenuItem onClick={onUploadFile}>
                        {menuOptions.uploadFile}
                    </ContextMenuItem>
                )}
                {onRename && (
                    <ContextMenuItem onClick={onRename}>
                        {menuOptions.rename}
                    </ContextMenuItem>
                )}
                {onDelete && (
                    <ContextMenuItem onClick={onDelete}>
                        {menuOptions.delete}
                    </ContextMenuItem>
                )}
                {onDownload && (
                    <ContextMenuItem onClick={onDownload}>
                        {menuOptions.download}
                    </ContextMenuItem>
                )}
                {onSelect && (
                    <ContextMenuItem onClick={onSelect}>
                        {menuOptions.select}
                    </ContextMenuItem>
                )}
                {onMove && (
                    <ContextMenuItem onClick={onMove}>
                        {menuOptions.move}
                    </ContextMenuItem>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}

