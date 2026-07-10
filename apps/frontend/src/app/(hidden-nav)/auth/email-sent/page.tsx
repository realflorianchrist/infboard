'use client'
import {CiCircleCheck} from "react-icons/ci";
import {Button} from "@workspace/ui/components/button";
import routes from "@/src/constants/routes";
import {useRouter} from "next/navigation";

export default function EmailSentPage() {
    const router = useRouter();

    return (
        <div className={'flex flex-col items-center text-center gap-5'}>
            <CiCircleCheck className={'text-8xl text-green-700'}/>
            Wir haben eine E-Mail mit einem Bestätigungslink an dich geschickt.
            <Button onClick={() => router.push(routes.HOME)}>zurück zur Startseite</Button>
        </div>
    );
}