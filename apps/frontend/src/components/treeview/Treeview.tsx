'use client'
import {useState} from "react";
import {dummyFolderTree} from "@/src/constants/dummyFiles";
import TreeNode from "@/src/components/treeview/TreeNode";

export default function Treeview() {
    const [folders, setFolders] = useState(dummyFolderTree);

    return (
        <div>
            {folders.map((folder) => (
                <TreeNode key={folder.id} folder={folder} />
            ))}
        </div>
    );
}