'use client'
import routes from "@/src/constants/routes";
import {Button} from "@workspace/ui/components/button";
import {useRouter} from "next/navigation";
import Header from "@/src/components/header/Header";

export default function NotFound() {
    const router = useRouter();

    return (
        <>
            <Header hideNavigation={true}/>
            <main>
                <div className={'flex flex-col items-center text-center gap-5 relative top-[25%]'}>
                    <div className={'text-9xl'}>404</div>
                    Hoppla, diese Seite gibt es nicht!
                    <Button onClick={() => router.push(routes.HOME)}>zurück zur Startseite</Button>
                </div>
            </main>
        </>
    );
}