'use client'
import Navigation from "./Navigation";
import {Avatar, AvatarFallback} from "@workspace/ui/components/avatar";
import {IoIosPerson} from "react-icons/io";
import {userDetails} from "@/src/utils/userDetails";
import HeaderBrand from "@/src/components/header/HeaderBrand";
import UserSheetMenu from "@/src/components/menus/UserSheetMenu";

export default function Header({hideNavigation}: {hideNavigation?: boolean}) {

    return (
        <header className={'flex items-center justify-between w-full p-4'}>
            <HeaderBrand/>

            {!hideNavigation && (
                <>
                    <div className={'absolute left-1/2 -translate-x-1/2'}>
                        <Navigation/>
                    </div>

                    <UserSheetMenu>
                        <span className={'flex items-center justify-center gap-4 cursor-pointer'}>
                            {userDetails().getUserInfos()?.username}
                            <Avatar>
                                <AvatarFallback>
                                    <IoIosPerson className={'w-10 h-10'}/>
                                </AvatarFallback>
                            </Avatar>
                        </span>
                    </UserSheetMenu>
                </>
            )}
        </header>
    );
}