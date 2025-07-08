'use client'
import Routes from "@/src/constants/routes";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Separator} from "@workspace/ui/components/separator";
import SearchBar from "@/src/components/header/SearchBar";
import {useState} from "react";

export default function Navigation() {
    const path = usePathname();

    const [isSearching, setIsSearching] = useState(false);

    return (
        <nav className={'flex gap-4 items-center h-5'}>
            {isSearching ? (
                <SearchBar setIsSearching={setIsSearching}/>
            ) : (
                <>
                    <Link
                        href={Routes.HOME}
                        className={path === Routes.HOME ? 'text-accent' : ''}
                    >
                        Daten
                    </Link>
                    <Separator orientation="vertical"/>
                    <Link
                        href={Routes.DASHBOARD}
                        className={path === Routes.DASHBOARD ? 'text-accent' : ''}
                    >
                        Dashboard
                    </Link>
                    <Separator orientation="vertical"/>
                    <div
                        onClick={()=>setIsSearching(!isSearching)}
                        className={`cursor-pointer ${path === Routes.SEARCH ? 'text-accent' : ''}`}
                    >
                        Suchen
                    </div>
                </>
            )}
        </nav>
    );
}