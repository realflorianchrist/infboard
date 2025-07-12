'use client'
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import Routes from "@/src/constants/routes";

export default function Home() {

    const router = useRouter();

    useEffect(() => {
        router.push(Routes.HOME);
    });

    return null;
}
