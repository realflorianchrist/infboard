import React from 'react'
import {Folder} from "@workspace/types";
import {IoFolderOutline} from "react-icons/io5";
import {cn} from "@workspace/ui/lib/utils";

type Props = React.ComponentProps<"div"> & {
    folder: Folder
};

export default function FolderItem({folder, className, ...props}: Props) {
    return (
        <div className={cn('flex items-center gap-2', className)}
             {...props}
        >
            <IoFolderOutline/>
            <span className="truncate whitespace-nowrap">{folder.name}</span>
        </div>
    );
}
