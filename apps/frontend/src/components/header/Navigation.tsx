'use client'
import Routes from "@/src/constants/routes";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Separator} from "@workspace/ui/components/separator";

export default function Navigation() {
    const path = usePathname()

    return (
        <nav className={'flex gap-4 items-center h-5'}>
            <Link
                href={Routes.HOME}
                className={path === Routes.HOME ? 'text-accent' : ''}
            >
                Daten
            </Link>
            <Separator orientation="vertical" />
            <Link
                href={Routes.DASHBOARD}
                className={path === Routes.DASHBOARD ? 'text-accent' : ''}
            >
                Dashboard
            </Link>
            <Separator orientation="vertical" />
            <Link
                href={Routes.SEARCH}
                className={path === Routes.SEARCH ? 'text-accent' : ''}
            >
                Suchen
            </Link>
        </nav>
    );
}