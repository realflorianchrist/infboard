import {Folder} from "@workspace/types/data";
import {useState} from "react";
import {VscChevronDown, VscChevronRight} from "react-icons/vsc";

export default function TreeNode({folder, depth = 0}: { folder: Folder; depth?: number }) {
    const [isOpen, setIsOpen] = useState(folder.isOpen ?? false);

    return (
        <div>
            <div
                className={`
          cursor-pointer flex items-center gap-2 
          px-2 py-1 rounded
          hover:bg-accent/20
        `}
                style={{paddingLeft: `${depth * 1}rem`}}
                onClick={() => setIsOpen(!isOpen)}
            >
                {folder.children?.length ? (
                    isOpen ? <VscChevronDown/> : <VscChevronRight/>
                ) : (
                    <div className="w-4"/>
                )}
                <span>{folder.name}</span>
            </div>

            {isOpen && folder.children?.map((child) => (
                <TreeNode key={child.id} folder={child} depth={depth + 1}/>
            ))}
        </div>
    );
}
