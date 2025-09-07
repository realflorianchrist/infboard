'use client'
import TreeNode from "@/src/components/treeview/TreeNode";
import {useGetAllFolders} from "@/src/api/hooks/api_hooks/folderHooks";
import {useDroppable} from "@dnd-kit/core";
import {ROOT_FOLDER_ID} from "@workspace/constants";

export default function Treeview() {
    const {data} = useGetAllFolders();

    const {setNodeRef} = useDroppable({id: `${ROOT_FOLDER_ID}-tree`});

    return (
        <div ref={setNodeRef}
             className={'h-full'}
        >
            {data?.folders.map((folder) => (
                <TreeNode key={folder.id} folder={folder} />
            ))}
        </div>
    );
}