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
        <nav className="flex gap-4 items-center h-5 relative">
            <div
                className={`flex items-center gap-4 transition-all duration-300 ${
                    isSearching ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
                }`}
            >
                <Link
                    href={Routes.HOME}
                    className={path.includes('folder') ? 'text-accent' : ''}
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
                    onClick={() => setIsSearching(true)}
                    className={`cursor-pointer ${path === Routes.SEARCH ? 'text-accent' : ''}`}
                >
                    Suchen
                </div>
            </div>

            <div
                className={`
                    absolute right-0
                    overflow-hidden
                    transition-all duration-700
                    ${isSearching ? 'w-full opacity-100 pointer-events-auto' : 'w-0 opacity-0 pointer-events-none'}
                  `}
            >
                <SearchBar setIsSearching={setIsSearching}/>
            </div>
        </nav>
    );
}
