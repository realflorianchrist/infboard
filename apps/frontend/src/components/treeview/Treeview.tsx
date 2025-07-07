'use client'
import {useEffect, useState} from "react";
import {dummyFolderTree} from "@/src/constants/dummyFiles";
import TreeNode from "@/src/components/treeview/TreeNode";
import {useGetAllFolders} from "@/src/api/hooks/folderHooks";
import {Folder} from "@workspace/types/data";

export default function Treeview() {
    const [folders, setFolders] = useState<Folder[]>([]);

    const {data} = useGetAllFolders();

    useEffect(() => {
        if (data) setFolders(data.folders);
    }, [data]);

    return (
        <div>
            {folders.map((folder) => (
                <TreeNode key={folder.id} folder={folder} />
            ))}
        </div>
    );
}