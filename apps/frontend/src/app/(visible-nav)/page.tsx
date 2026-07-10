'use client'
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import routes from "@/src/constants/routes";

export default function Home() {

    const router = useRouter();

    useEffect(() => {
        router.push(routes.HOME);
    });

    return null;
}
