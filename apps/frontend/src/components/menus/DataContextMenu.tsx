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
    onEdit?: () => void;
    onDelete?: () => void;
    onDownload?: () => void;
    onSelect?: () => void;
};

export default function DataContextMenu(
    {
        children,
        onNewFolder,
        onEdit,
        onDelete,
        onDownload,
        onSelect,
        onUploadFile,
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
                {onEdit && (
                    <ContextMenuItem onClick={onEdit}>
                        {menuOptions.edit}
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
            </ContextMenuContent>
        </ContextMenu>
    );
}

