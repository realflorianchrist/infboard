'use client'
import {Input} from "@workspace/ui/components/input";
import {Label} from "@workspace/ui/components/label";
import {Button} from "@workspace/ui/components/button";
import {FormEvent, useState} from "react";
import {z} from "zod";
import {AuthUser, ErrorType} from "@workspace/types";
import {useLogin} from "@/src/api/hooks/api_hooks/authHooks";
import {toast} from "sonner";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import routes from "@/src/constants/routes";
import {useRouter} from "next/navigation";
import {successMessage} from "@/src/utils/getSuccessMessage";
import AuthForm from "@/src/components/auth/form/AuthForm";
import FormItem from "@/src/components/auth/form/FormItem";
import PasswordInputField from "@/src/components/auth/form/PasswordInputField";
import Loader from "@/src/components/loader/Loader";


export default function LoginForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const loginMutation = useLogin();


    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        const user = getAuthUser();

        loginMutation.mutate({user}, {
            onSuccess: async () => {
                toast.success(successMessage.LOGIN_SUCCESSFUL);
                // window.location.replace(routes.HOME); // router.push doesn't work here sometimes
                await Promise.resolve();
                router.replace(routes.HOME);
            },
            onError: (e) => {
                if (e.errorType === ErrorType.VALIDATION_ERROR) {
                    e.validationErrors?.forEach((error) => {
                        toast.error(getErrorMessage(error));
                    });
                } else {
                    toast.error(getErrorMessage(e.errorType));
                }
            },
        });
    }

    const isEmail = (s: string) => z.string().email().safeParse(s).success;

    const getAuthUser = () => {
        const user: AuthUser = {
            password
        }

        if (isEmail(username)) {
            user.email = username;
        } else {
            user.username = username;
        }

        return user;
    }

    return (
        <>
            {loginMutation.isPending && <Loader isFullScreen={true}/>}

            <AuthForm
                onSubmit={handleLogin}
            >
                <FormItem>
                    <Label htmlFor='username'>Username / E-Mail</Label>
                    <Input
                        id='username'
                        required={true}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </FormItem>

                <FormItem>
                    <Label htmlFor='password'>Passwort</Label>
                    <PasswordInputField
                        id={'password'}
                        required={true}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </FormItem>

                <div className={'flex flex-col items-start'}>
                    <Button
                        variant={'link'}
                        type={'button'}
                        onClick={() => router.push(routes.RESET_PASSWORD)}
                        className={'p-0'}
                    >
                        Passwort vergessen?
                    </Button>
                </div>

                <Button type={'submit'}>
                    Login
                </Button>

                <div className={'flex self-center items-center text-sm gap-3'}>
                    <p>Noch kein Account?</p>
                    <Button
                        variant={'link'}
                        type={'button'}
                        onClick={() => router.push(routes.REGISTER)}
                        className={'p-0'}
                    >
                        Registrieren
                    </Button>
                </div>
            </AuthForm>
        </>
    );
}