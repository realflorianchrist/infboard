import React from 'react'
import {cn} from "@workspace/ui/lib/utils";

type Props = React.ComponentProps<"button">;

export default function SearchResultContainer({className, ...props}: Props) {
    return (
        <button
            type="button"
            className={cn('w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent/15',
                'flex gap-1 justify-between',
                className)
            }
            {...props}
        />
    );
}
