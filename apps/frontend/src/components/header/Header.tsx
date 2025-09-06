'use client'
import Link from "next/link";
import routes from "@/src/constants/routes";
import Navigation from "./Navigation";
import {Avatar, AvatarFallback} from "@workspace/ui/components/avatar";
import {IoIosPerson} from "react-icons/io";
import UserDropDownMenu from "@/src/components/menus/UserDropDownMenu";
import {usePathname} from "next/navigation";
import {userDetails} from "@/src/utils/userDetails";

export default function Header() {

    const pathName = usePathname();

    return (
        <header className={'flex items-center justify-between w-full p-4'}>
            <Link
                href={routes.HOME}
                className="text-2xl font-bold text-accent"
            >
                infboard.ch
            </Link>

            {!pathName.includes('/auth') && (
                <>
                    <div className={'absolute left-1/2 -translate-x-1/2'}>
                        <Navigation/>
                    </div>

                    <UserDropDownMenu>
                        <div className={'flex items-center justify-center gap-4 cursor-pointer'}>
                            {userDetails().getUserInfos()?.username}
                            <Avatar>
                                <AvatarFallback>
                                    <IoIosPerson className={'w-10 h-10'}/>
                                </AvatarFallback>
                            </Avatar>
                        </div>
                    </UserDropDownMenu>
                </>
            )}
        </header>
    );
}