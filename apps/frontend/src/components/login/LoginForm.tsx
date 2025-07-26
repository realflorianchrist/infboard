'use client'
import {Avatar, AvatarFallback} from "@workspace/ui/components/avatar";
import {IoIosPerson} from "react-icons/io";
import {Input} from "@workspace/ui/components/input";
import {Label} from "@workspace/ui/components/label";
import {Button} from "@workspace/ui/components/button";
import {Dispatch, FormEvent, SetStateAction, useState} from "react";
import {z} from "zod";
import {AuthUser} from "@workspace/types/user";
import {useLogin, useRegister} from "@/src/api/hooks/api_hooks/authHooks";
import {toast} from "sonner";
import {getErrorMessage} from "@/src/utils/getErrorMessage";


export default function LoginForm(
    {
        setIsResetPassword
    }: {
        setIsResetPassword: Dispatch<SetStateAction<boolean>>;
    }) {

    const [isRegister, setIsRegister] = useState(false);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState<string[]>([]);

    const loginMutation = useLogin();
    const registerMutation = useRegister();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage([]);

        const user = getAuthUser();

        loginMutation.mutate({user}, {
            onSuccess: () => {
                toast.success("Login erfolgreich");
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

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setErrorMessage([]);

        if (!checkPasswords()) return;

        const user = getAuthUser();

        registerMutation.mutate({user}, {
            onSuccess: () => {
                toast.success("Registrierung erfolgreich");
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

    const checkPasswords = () => {
        if (password !== confirmPassword) {
            setErrorMessage(["Die Passwörter stimmen nicht überein."]);
            return false;
        }
        return true;
    }

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
                  onSubmit={isRegister ? handleRegister : handleLogin}
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

                {isRegister ? (
                    <div className={'input-group'}>
                        <Label htmlFor='repeat-password'>Passwort wiederholen</Label>
                        <Input
                            id='repeat-password'
                            type='password'
                            required={true}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                ) : (
                    <div className={'flex flex-col items-start'}>
                        <Button
                            type={'button'}
                            variant={'link'}
                            className={'p-0'}
                            onClick={() => setIsResetPassword(true)}
                        >
                            Passwort vergessen?
                        </Button>
                    </div>
                )}
                <Button type={'submit'}>
                    {isRegister ? 'Registrieren' : 'Login'}
                </Button>
                <div className={'flex self-center items-center text-sm gap-3'}>
                    {isRegister ?
                        (
                            <p>
                                Schon registriert?
                            </p>
                        ) : (
                            <p>
                                Noch kein Account?
                            </p>
                        )}
                    <Button
                        type={'button'}
                        variant={'link'}
                        className={'p-0 font-bold'}
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        {isRegister ? 'Login' : 'Registrieren'}
                    </Button>
                </div>
            </form>
        </div>
    );
}