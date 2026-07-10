import {Avatar, AvatarFallback} from "@workspace/ui/components/avatar";
import {IoIosPerson} from "react-icons/io";
import {cn} from "@workspace/ui/lib/utils";

export default function AuthForm({className, ...props}: React.ComponentProps<"form">) {
    return (
        <div className={'flex flex-col items-center justify-center gap-10'}>
            <Avatar className={'w-20 h-20'}>
                <AvatarFallback>
                    <IoIosPerson className={'w-14 h-14'}/>
                </AvatarFallback>
            </Avatar>
            <form className={cn('flex flex-col gap-4 w-full', className)}
                  {...props}
            />
        </div>
    );
}