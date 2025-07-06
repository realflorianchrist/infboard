'use client'
import LoginForm from "@/src/components/login/LoginForm";
import {useState} from "react";
import ResetPasswordForm from "@/src/components/login/ResetPasswordForm";

export default function LoginPage() {
    const [isResetPassword, setIsResetPassword] = useState(false);

    return (
        <div className={'flex flex-col items-center mt-20'}>
            <div className={'w-3/4 md:w-2/5 lg:w-1/4 xl:w-1/5 2xl:w-1/7'}>
                {isResetPassword ?
                    (
                        <ResetPasswordForm/>
                    ) : (
                        <LoginForm setIsResetPassword={setIsResetPassword} />
                    )}
            </div>
        </div>
    );
}