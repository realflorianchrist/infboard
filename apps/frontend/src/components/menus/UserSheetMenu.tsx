'use client'
import React, {ReactNode} from 'react'
import {Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger} from "@workspace/ui/components/sheet";
import {Avatar, AvatarFallback} from "@workspace/ui/components/avatar";
import {IoIosPerson} from "react-icons/io";
import {Separator} from "@workspace/ui/components/separator";
import {userDetails} from "@/src/utils/userDetails";
import {useLogout} from "@/src/api/hooks/api_hooks/authHooks";
import {Button} from "@workspace/ui/components/button";
import {IoSettingsOutline} from "react-icons/io5";
import {useTheme} from "next-themes";
import {MdOutlineDarkMode, MdOutlineLightMode} from "react-icons/md";
import {FiLogOut, FiUpload} from "react-icons/fi";
import {cn} from "@workspace/ui/lib/utils";
import useToggleTheme from "@/src/hooks/useToggleTheme";

export default function UserSheetMenu({children}: { children: ReactNode }) {
    const logout = useLogout();
    const toggleTheme = useToggleTheme();
    const {theme} = useTheme();

    return (
        <Sheet>
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent className={'gap-0'}>
                <SheetHeader>
                    <SheetTitle className={'text-xl'}>Mein Account</SheetTitle>
                </SheetHeader>
                <Separator className={'my-0'}/>
                <div className={'flex flex-col items-center p-6 pt-12'}>
                    <div>
                        <Avatar className={'w-28 h-28'}>
                            <AvatarFallback>
                                <IoIosPerson size={'5rem'}/>
                            </AvatarFallback>
                        </Avatar>
                        <button
                            className={cn('flex items-center justify-center w-10 h-10 relative left-19 bottom-8',
                                'z-100 bg-background border rounded-full hover:border-accent active:border-accent/60')}>
                            <FiUpload/>
                        </button>
                    </div>
                    <div className={'text-xl'}>
                        {userDetails().getUserInfos()?.username}
                    </div>
                </div>
                <div className={'flex flex-col items-start p-3 gap-3'}>
                    <div className={'flex text-xl p-1 gap-4 items-center justify-center'}><
                        IoSettingsOutline/>Einstellungen
                    </div>

                    <button
                        className={'flex w-full p-1 gap-4 items-center justify-items-start cursor-pointer hover:bg-accent/15 rounded-md'}
                    >
                        <FiUpload/>
                        Meine Uploads
                    </button>

                    <button
                        className={'flex w-full p-1 gap-4 items-center justify-items-start cursor-pointer hover:bg-accent/15 rounded-md'}
                        onClick={toggleTheme}
                    >
                        {theme === 'dark'
                            ? <><MdOutlineLightMode/>Light mode</>
                            : <><MdOutlineDarkMode/>Dark mode</>
                        }
                    </button>
                </div>

                <SheetFooter>
                    <Button
                        variant={'destructive'}
                        onClick={logout}>
                        <FiLogOut/>
                        Abmelden
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
