import {Input} from "@workspace/ui/components/input";
import {Button} from "@workspace/ui/components/button";
import {XIcon} from "lucide-react";
import * as React from "react";
import {cn} from "@workspace/ui/lib/utils";

type Props = Omit<React.ComponentProps<"input">, 'placeholder'> & {
    isSearching: boolean;
    setIsSearching: (v: boolean) => void;
}

export default function SearchBar({isSearching, setIsSearching, className, ...props}: Props) {
    return (
        <div className={'flex'}>
            <Input
                {...props}
                type={'search'}
                className={cn('rounded-r-none focus-visible:ring-transparent', className)}
                placeholder={'Suchen..'}
            />
            <Button
                onClick={() => setIsSearching(false)}
                className={'rounded-l-none bg-accent hover:bg-accent/80 text-foreground text-xl'}
            >
                <XIcon/>
            </Button>
        </div>
    );
}