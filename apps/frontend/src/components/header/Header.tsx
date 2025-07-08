import ThemeSwitch from "@/src/components/ThemeSwitch";
import Link from "next/link";
import Routes from "@/src/constants/routes";
import Navigation from "./Navigation";
import {Avatar, AvatarFallback} from "@workspace/ui/components/avatar";
import {IoIosPerson} from "react-icons/io";

export default function Header() {
    return (
        <header className="flex items-center justify-between w-full p-4">
            <Link
                href={Routes.HOME}
                className="text-2xl font-bold text-accent"
            >
                infboard.ch
            </Link>

            <div className="absolute left-1/2 -translate-x-1/2">
                <Navigation />
            </div>

            <div className={'flex items-center justify-center gap-4'}>
                User
                <Avatar>
                    <AvatarFallback>
                        <IoIosPerson className={'w-10 h-10'}/>
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    );
}