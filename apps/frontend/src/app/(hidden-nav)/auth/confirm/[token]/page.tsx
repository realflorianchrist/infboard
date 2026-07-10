'use client';
import {use, useEffect} from "react";
import {useConfirmEmail} from "@/src/api/hooks/api_hooks/authHooks";
import Loader from "@/src/components/loader/Loader";
import {userDetails} from "@/src/utils/userDetails";
import {CiCircleCheck} from "react-icons/ci";
import {IoIosCloseCircleOutline} from "react-icons/io";
import {Button} from "@workspace/ui/components/button";
import routes from "@/src/constants/routes";
import {useRouter} from "next/navigation";
import {getErrorMessage} from "@/src/utils/getErrorMessage";

type Props = {
    params: Promise<{ token: string }>
};

export default function ConfirmPage({params}: Props) {
    const {token} = use(params)

    const confirmEmail = useConfirmEmail();

    const router = useRouter();

    useEffect(() => {
        if (token) {
            confirmEmail.mutate({token});
        }
    }, [token]);

    if (confirmEmail.isPending) return <Loader isFullScreen/>;

    return (
        <>
            <div className={'flex flex-col items-center text-center gap-5'}>

                {confirmEmail.isSuccess && (
                    <>
                        <CiCircleCheck className={'text-8xl text-green-700'}/>
                        E-Mail erfolgreich verifiziert.
                        <Button onClick={() => router.push(routes.HOME)}>zurück zur Startseite</Button>
                    </>
                )}

                {confirmEmail.isError && (
                    <>
                        <IoIosCloseCircleOutline className={'text-8xl text-error'}/>
                        {getErrorMessage(confirmEmail.error.errorType)}
                        <Button onClick={() => router.push(routes.HOME)}>zurück zur Startseite</Button>
                    </>
                )}

            </div>
        </>
    );
};
