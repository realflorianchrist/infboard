import React from 'react'
import {useGetAllFolders} from "@/src/api/hooks/api_hooks/folderHooks";
import findFolderPathById from "@/src/utils/findFolderPathById";
import {cn} from "@workspace/ui/lib/utils";

type Props = React.ComponentProps<"div"> & {
    parentFolderId?: string
};

export default function ResultPath({parentFolderId, className, ...props}: Props) {
    const {data: folderTree} = useGetAllFolders();

    const path = findFolderPathById(folderTree?.folders, parentFolderId);

    return (
        <div
            className={cn('text-muted-foreground italic font-sans', className)}
            {...props}
        >
            Home/{path?.map(p => `${p.name}/`)}
        </div>
    )
}
