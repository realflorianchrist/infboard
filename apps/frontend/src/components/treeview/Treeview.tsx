'use client'
import TreeNode from "@/src/components/treeview/TreeNode";
import {useGetAllFolders} from "@/src/api/hooks/folderHooks";

export default function Treeview() {
    const {data} = useGetAllFolders();

    return (
        <div>
            {data?.folders.map((folder) => (
                <TreeNode key={folder.id} folder={folder} />
            ))}
        </div>
    );
}