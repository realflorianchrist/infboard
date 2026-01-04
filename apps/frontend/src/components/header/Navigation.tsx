'use client'
import routes from "@/src/constants/routes";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {Separator} from "@workspace/ui/components/separator";
import {useState} from "react";
import SearchBarWithResults from "@/src/components/searchbar/SearchBarWithResults";

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
                    href={routes.HOME}
                    className={path.includes('folder') ? 'text-accent' : ''}
                >
                    Daten
                </Link>
                <Separator orientation="vertical"/>
                <Link
                    href={routes.DASHBOARD}
                    className={path === routes.DASHBOARD ? 'text-accent' : ''}
                >
                    Dashboard
                </Link>
                <Separator orientation="vertical"/>
                <button
                    onClick={() => setIsSearching(true)}
                    className={`cursor-pointer ${path === routes.SEARCH ? 'text-accent' : ''}`}
                >
                    Suchen
                </button>
            </div>

            <div
                className={`
                    absolute right-0
                    overflow-hidden
                    transition-all duration-700
                    ${isSearching ? 'w-full opacity-100 pointer-events-auto' : 'w-0 opacity-0 pointer-events-none'}
                  `}
            >
                <SearchBarWithResults
                    isSearching={isSearching}
                    setIsSearching={setIsSearching}
                />
            </div>
        </nav>
    );
}
