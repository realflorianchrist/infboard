import ThemeSwitch from "@/src/components/ThemeSwitch";
import Link from "next/link";
import Routes from "@/src/constants/routes";
import Navigation from "./Navigation";

export default function Header() {
    return (
        <header className="flex items-center justify-between w-full p-4">
            <Link href={Routes.HOME} className="text-2xl font-bold text-accent">
                infboard.ch
            </Link>

            <Navigation />

            <div>
                User
            </div>
        </header>
    );
}