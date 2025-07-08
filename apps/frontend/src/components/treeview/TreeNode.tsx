import {useFolderPath} from "@/src/providers/FolderPathProvider";
import {Folder} from "@workspace/types/data";
import {useState} from "react";
import {VscChevronDown, VscChevronRight} from "react-icons/vsc";
import {FolderPathSegment} from "@workspace/types/folderPath";
import {IoFolderOutline} from "react-icons/io5";
import FolderContextMenu from "@/src/components/context_menus/FolderContextMenu";

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

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <FolderContextMenu>
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
                        className="flex items-center gap-2"
                        onClick={() =>
                            setPath([...parents, {id: folder.id, name: folder.name}])
                        }
                        onDoubleClick={() => setIsOpen(!isOpen)}
                    >
                        <IoFolderOutline/>
                        <div>
                            {folder.name}
                        </div>
                    </div>
                </div>
            </FolderContextMenu>

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
