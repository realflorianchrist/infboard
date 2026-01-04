import React from 'react'
import {FileMeta} from "@workspace/types";
import {getFileSymbol} from "@/src/utils/getFileSymbol";
import {cn} from "@workspace/ui/lib/utils";

type Props = React.ComponentProps<"div"> & {
    file: FileMeta
};

export default function FileItem({file, className, ...props}: Props) {
    return (
        <div className={cn('flex items-center', className)}
             {...props}
        >
            <span className={'w-6 flex'}>{getFileSymbol(file.contentType)}</span>
            <span className={'truncate whitespace-nowrap'}>{file.name}</span>
        </div>
    );
}
