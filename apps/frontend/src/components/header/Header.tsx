import ThemeSwitch from "@/src/components/ThemeSwitch";
import Link from "next/link";
import {Routes} from "@/src/constants/routes";

export default function Header() {
    return (
        <header className={'flex w-full p-4 items-center'}>
            <Link
                href={Routes.HOME}
                className={'text-2xl font-bold text-accent'}
            >
                infboard.ch
            </Link>
            <div className={'ml-auto'}>
                <ThemeSwitch/>
            </div>
        </header>
    );
}