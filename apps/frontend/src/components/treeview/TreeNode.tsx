import {Folder} from "@workspace/types/data";
import {useState} from "react";
import {IoFolderOutline} from "react-icons/io5";
import {VscChevronDown, VscChevronRight} from "react-icons/vsc";

export default function TreeNode({folder}: { folder: Folder }) {
    const [isOpen, setIsOpen] = useState(folder.isOpen ?? false);

    return (
        <div className={'pl-2'}>
            <div
                className={'cursor-pointer flex gap-2 items-center'}
                onClick={() => setIsOpen(!isOpen)}
            >
                {folder.children?.length ? (
                    isOpen ? <VscChevronDown/> : <VscChevronRight/>
                ) : (
                    <div className="w-4"/>
                )}
                {folder.name}
            </div>

            {isOpen && (
                <div className={'ml-2'}>
                    {folder.children?.map((child) => (
                        <TreeNode key={child.id} folder={child}/>
                    ))}
                </div>
            )}
        </div>
    );
}