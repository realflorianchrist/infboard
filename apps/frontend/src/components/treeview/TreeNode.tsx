'use client'
import {Folder} from "@workspace/types/data";
import {useEffect, useState} from "react";
import {VscChevronDown, VscChevronRight} from "react-icons/vsc";
import {FolderPathSegment} from "@workspace/types/folderPath";
import {IoFolderOutline} from "react-icons/io5";
import DataContextMenu from "@/src/components/menus/DataContextMenu";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";
import {useFolderPath} from "@/src/hooks/useFolderPath";
import {useDroppable} from "@dnd-kit/core";
import {cn} from "@workspace/ui/lib/utils";

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

    const {setNodeRef, isOver} = useDroppable({id: folder.id});

    const [isOpen, setIsOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            return sessionStorage.getItem(`open-${folder.id}`) === 'true';
        }
        return false;
    });

    useEffect(() => {
        sessionStorage.setItem(`open-${folder.id}`, isOpen.toString());
    }, [isOpen]);

    return (
        <div
            ref={setNodeRef}
            className={cn("p-1 rounded", isOver && "bg-accent")}
        >
            <DataContextMenu
                onNewFolder={() => openNewFolderModal(folder.id)}
                onRename={() => openRenameFolderModal(folder.id, folder.name)}
                onDelete={() => openDeleteFolderModal(folder.id)}
                onUploadFile={() => openUploadFileModal(folder.id)}
            >
                <div
                    className={`cursor-pointer select-none flex items-center gap-2 text-sm
                          px-2 py-1 rounded
                          hover:bg-accent/10
                          ${path[path.length - 1]?.id === folder.id ? 'bg-accent/20' : ''}
                        `}
                    style={{paddingLeft: `${depth * 1}rem`}}

                >
                    {folder.children?.length ? (
                        <button
                            className={`cursor-pointer`}
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <VscChevronDown/> : <VscChevronRight/>}
                        </button>
                    ) : (
                        <div className="w-4"/>
                    )}
                    <div
                        className="flex items-center gap-2 flex-1"
                        onClick={() => {
                            pushFolderById(folder.id);
                            setSelected([]);
                        }}
                    >
                        <IoFolderOutline className={'shrink-0'}/>
                        <div>
                            {folder.name}
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
