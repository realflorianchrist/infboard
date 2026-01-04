'use client'
import {Folder, FolderPathSegment} from "@workspace/types";
import {useEffect, useState} from "react";
import {VscChevronDown, VscChevronRight} from "react-icons/vsc";
import {IoFolderOutline} from "react-icons/io5";
import DataContextMenu from "@/src/components/menus/DataContextMenu";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import {useDraggable, useDroppable} from "@dnd-kit/core";
import {cn} from "@workspace/ui/lib/utils";
import {useHasSelectedAncestor} from "@/src/hooks/useHasSelectedAncestor";
import FolderItem from "@/src/components/data_table/FolderItem";

export default function TreeNode(
    {
        folder,
        depth = 0,
        parents = [],
    }: {
        folder: Folder;
        depth?: number;
        parents?: FolderPathSegment[];
    }) {

    const {path, pushFolderById} = useFolderPath();
    const {
        openNewFolderModal,
        openRenameFolderModal,
        openDeleteFolderModal,
        setSelected,
        openUploadFileModal,
    } = useContextMenu();

    const {attributes, listeners, setNodeRef: setDraggableRef} = useDraggable({
        id: `${folder.id}-treeNode`,
        data: folder
    });
    const {setNodeRef: setDroppableRef, isOver, node: dropNode, active} = useDroppable({id: `${folder.id}-treeNode`});

    const {isSelected, selected} = useContextMenu();

    const {hasSelectedAncestor} = useHasSelectedAncestor();

    const [isOpen, setIsOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem(`open-${folder.id}`) === 'true'
                || path.some((s) => s.id === folder.id);
        }
        return false;
    });

    useEffect(() => {
        sessionStorage.setItem(`open-${folder.id}`, isOpen.toString());
    }, [isOpen]);

    const draggedItemId = (active?.id as string)?.split('-')[0];

    const canDrop = isOver
        && draggedItemId !== folder.id
        && !hasSelectedAncestor(folder.id)
        && !isSelected(folder.id);

    return (
        <div>
            <DataContextMenu
                onNewFolder={() => openNewFolderModal(folder.id)}
                onEdit={() => openRenameFolderModal(folder.id, folder.name, folder.parentFolderId)}
                onDelete={() => openDeleteFolderModal(folder.id)}
                onUploadFile={() => openUploadFileModal(folder.id)}
            >
                <div
                    id={`${folder.id}-treeNode`}
                    ref={(node) => {
                        setDroppableRef(node);
                        setDraggableRef(node);
                    }}
                    className={cn('cursor-pointer select-none flex items-center gap-2 text-sm',
                        'px-2 py-2 rounded-md hover:bg-accent/10',
                        {
                            'bg-accent/20': (path[path.length - 1]?.id === folder.id),
                            'bg-accent/40': canDrop
                        })}
                    style={{paddingLeft: `${depth * 1}rem`}}
                    {...attributes}
                    {...listeners}
                >
                    <div className={'flex items-center'}>
                        <div className={'w-8 flex justify-center'}>
                            {folder.children?.length! > 0 && (
                                <button
                                    className={'cursor-pointer'}
                                    onClick={() => setIsOpen(!isOpen)}
                                >
                                    {isOpen ? <VscChevronDown /> : <VscChevronRight />}
                                </button>
                            )}
                        </div>

                        <div
                            className={'flex items-center gap-2 flex-1'}
                            onClick={() => {
                                pushFolderById(folder.id);
                                setSelected([]);
                            }}
                        >
                            <FolderItem folder={folder} />
                        </div>
                    </div>
                </div>
            </DataContextMenu>

            {isOpen &&
                folder.children?.map((child) => (
                    <TreeNode
                        key={child.id}
                        folder={child}
                        depth={depth + 1}
                        parents={[...parents, {id: folder.id, name: folder.name}]}
                    />
                ))}

        </div>
    );
}
