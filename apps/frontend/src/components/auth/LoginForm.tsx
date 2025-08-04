'use client'
import {Avatar, AvatarFallback} from "@workspace/ui/components/avatar";
import {IoIosPerson} from "react-icons/io";
import {Input} from "@workspace/ui/components/input";
import {Label} from "@workspace/ui/components/label";
import {Button} from "@workspace/ui/components/button";
import {FormEvent, useState} from "react";
import {z} from "zod";
import {AuthUser} from "@workspace/types/user";
import {useLogin} from "@/src/api/hooks/api_hooks/authHooks";
import {toast} from "sonner";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import routes from "@/src/constants/routes";
import {useRouter} from "next/navigation";
import {ErrorType} from "@workspace/types/apiResponses";
import {successMessage} from "@/src/utils/getSuccessMessage";


export default function LoginForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const loginMutation = useLogin();


    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        const user = getAuthUser();

        loginMutation.mutate({user}, {
            onSuccess: () => {
                toast.success(successMessage.LOGIN_SUCCESSFUL);
                window.location.replace(routes.HOME);
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
        <div className={'flex flex-col items-center justify-center gap-10'}>
            <Avatar className={'w-20 h-20'}>
                <AvatarFallback>
                    <IoIosPerson className={'w-14 h-14'}/>
                </AvatarFallback>
            </Avatar>
            <form className={'flex flex-col gap-4 w-full'}
                  onSubmit={handleLogin}
            >
                <div className={'input-group'}>
                    <Label htmlFor='username'>Username / E-Mail</Label>
                    <Input
                        id='username'
                        required={true}
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className={'input-group'}>
                    <Label htmlFor='password'>Passwort</Label>
                    <Input
                        id='password'
                        type='password'
                        required={true}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

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
            </form>
        </div>
    );
}