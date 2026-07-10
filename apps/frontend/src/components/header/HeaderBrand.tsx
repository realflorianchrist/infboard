import Link from "next/link";
import routes from "@/src/constants/routes";

export default function HeaderBrand() {
    return (
        <Link
            href={routes.HOME}
            className="text-2xl font-bold text-accent"
        >
            infboard.ch
        </Link>
    );
}