import {cn} from "@workspace/ui/lib/utils";

export default function FormItem({className, ...props}: React.ComponentProps<"div">) {
    return (
        <div className={cn('flex flex-col gap-2', className)}
             {...props}
        />
    );
}