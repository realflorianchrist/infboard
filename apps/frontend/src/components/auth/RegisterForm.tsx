'use client'
import {Avatar, AvatarFallback} from "@workspace/ui/components/avatar";
import {IoIosPerson} from "react-icons/io";
import {Input} from "@workspace/ui/components/input";
import {Label} from "@workspace/ui/components/label";
import {Button} from "@workspace/ui/components/button";
import {FormEvent, useState} from "react";
import {AuthUser} from "@workspace/types/user";
import {useRegister} from "@/src/api/hooks/api_hooks/authHooks";
import {toast} from "sonner";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import routes from "@/src/constants/routes";
import {useRouter} from "next/navigation";
import {ErrorType} from "@workspace/types/apiResponses";
import {successMessage} from "@/src/utils/getSuccessMessage";
import {UserValidationErrorType} from "@workspace/types/modelValidation";


export default function RegisterForm() {

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();
    const registerMutation = useRegister();


    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        if (!checkPasswords()) return;

        const user: AuthUser = {
            username,
            email,
            password,
        }

        registerMutation.mutate({user}, {
            onSuccess: () => {
                toast.success(successMessage.REGISTER_SUCCESSFUL);
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

    const checkPasswords = () => {
        if (password !== confirmPassword) {
            toast.error(getErrorMessage(UserValidationErrorType.PASSWORDS_NOT_MATCHING));
            return false;
        }
        return true;
    }

    return (
        <div className={'flex flex-col items-center justify-center gap-10'}>
            <Avatar className={'w-20 h-20'}>
                <AvatarFallback>
                    <IoIosPerson className={'w-14 h-14'}/>
                </AvatarFallback>
            </Avatar>
            <form className={'flex flex-col gap-4 w-full'}
                  onSubmit={handleRegister}
            >
                <div className={'input-group'}>
                    <Label htmlFor='email'>E-Mail</Label>
                    <Input
                        id='email'
                        type='email'
                        required={true}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={'input-group'}>
                    <Label htmlFor='username'>Username</Label>
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

                <Button type={'submit'}>
                    Registrieren
                </Button>
                <div className={'flex self-center items-center text-sm gap-3'}>
                    <p>Schon registriert?</p>
                    <Button
                        variant={'link'}
                        type={'button'}
                        onClick={() => router.push(routes.LOGIN)}
                        className={'p-0'}
                    >
                        Login
                    </Button>
                </div>
            </form>
        </div>
    );
}