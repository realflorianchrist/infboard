import ThemeSwitch from "@/src/components/ThemeSwitch";
import Link from "next/link";
import {Routes} from "@/src/constants/routes";

export default function Header() {
    return (
        <header className={'flex w-full bg-background p-4'}>
            <Link href={Routes.HOME}>infboard.ch</Link>
            <div className={'ml-auto'}>
                <ThemeSwitch/>
            </div>
        </header>
    );
}