import React from 'react'
import {FileMeta} from "@workspace/types";
import {getFileSymbol} from "@/src/utils/getFileSymbol";
import {cn} from "@workspace/ui/lib/utils";

type Props = React.ComponentProps<"div"> & {
    file: FileMeta
};

export default function FileItem({file, className, ...props}: Props) {
    return (
        <div className={cn('flex items-center gap-2', className)}
             {...props}
        >
            {getFileSymbol(file.contentType)}
                <span className="truncate whitespace-nowrap">{file.name}</span>
        </div>
    );
}
