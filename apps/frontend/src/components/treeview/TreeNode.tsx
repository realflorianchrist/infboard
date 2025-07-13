'use client'
import {useFolderPath} from "@/src/providers/FolderPathProvider";
import {Folder} from "@workspace/types/data";
import {useEffect, useState} from "react";
import {VscChevronDown, VscChevronRight} from "react-icons/vsc";
import {FolderPathSegment} from "@workspace/types/folderPath";
import {IoFolderOutline} from "react-icons/io5";
import DataContextMenu from "@/src/components/menus/DataContextMenu";
import {useContextMenu} from "@/src/providers/ContextMenuProvider";

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

    const {path, setPath} = useFolderPath();
    const {
        openNewFolderModal,
        openRenameFolderModal,
        openDeleteFolderModal,
        setSelected,
        addSelected,
        openUploadFileModal,
    } = useContextMenu();

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
        <div>
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
                            setPath([...parents, {id: folder.id, name: folder.name}]);
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
