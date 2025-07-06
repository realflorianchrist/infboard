import {useFolderPath} from "@/src/providers/FolderPathProvider";
import {Folder} from "@workspace/types/data";
import {useState} from "react";
import {VscChevronDown, VscChevronRight} from "react-icons/vsc";
import {FolderPathSegment} from "@workspace/types/folderPath";

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

    const [isOpen, setIsOpen] = useState(folder.isOpen ?? false);

    return (
        <div>
            <div
                className={`
          cursor-pointer flex items-center gap-2 
          px-2 py-1 rounded
          hover:bg-accent/10
          ${path[path.length - 1]?.id === folder.id ? 'bg-accent/20' : ''}
        `}
                style={{paddingLeft: `${depth * 1}rem`}}
                onClick={() =>
                    setPath([...parents, {id: folder.id, name: folder.name}])
                }
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
                <span>{folder.name}</span>
            </div>

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
