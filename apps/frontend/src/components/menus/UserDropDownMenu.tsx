'use client'
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@workspace/ui/components/dropdown-menu";
import {ReactNode, useRef} from "react";
import ThemeSwitch from "@/src/components/ThemeSwitch";
import {useLogout} from "@/src/api/hooks/api_hooks/authHooks";

export default function UserDropDownMenu({children}: { children: ReactNode }) {
    const logout = useLogout();
    const switchRef = useRef<HTMLButtonElement>(null);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent align={'end'}>
                <DropdownMenuLabel>Mein Account</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem>Meine Uploads</DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    switchRef.current?.click();
                }}>
                    Dark mode <ThemeSwitch ref={switchRef}/>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Abmelden</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}