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
import Routes from "@/src/constants/routes";
import {useRouter} from "next/navigation";


export default function LoginForm() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    const router = useRouter();
    const loginMutation = useLogin();


    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage([]);

        const user = getAuthUser();

        loginMutation.mutate({user}, {
            onSuccess: () => {
                setTimeout(() => {
                    toast.success("Login erfolgreich");
                    router.push(Routes.HOME);
                }, 100);
            },
            onError: (e) => {
                const messages: string[] = [];
                e.validationErrors?.forEach((error) => {
                    messages.push(getErrorMessage(error));
                })
                setErrorMessage(messages);
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

                {errorMessage.length > 0 && (
                    <ul className={'text-error whitespace-normal break-all pt-2'}>
                        {errorMessage.map((error, i) => (
                            <li key={i}>{error}</li>
                        ))}
                    </ul>
                )}

                <div className={'flex flex-col items-start'}>
                    <Button
                        variant={'link'}
                        type={'button'}
                        onClick={() => router.push(Routes.RESET_PASSWORD)}
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
                        onClick={() => router.push(Routes.REGISTER)}
                        className={'p-0'}
                    >
                        Registrieren
                    </Button>
                </div>
            </form>
        </div>
    );
}