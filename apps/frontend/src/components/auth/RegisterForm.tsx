'use client'
import {Input} from "@workspace/ui/components/input";
import {Label} from "@workspace/ui/components/label";
import {Button} from "@workspace/ui/components/button";
import {FormEvent, useState} from "react";
import {AuthUser, ErrorType, UserValidationErrorType} from "@workspace/types";
import {useRegister} from "@/src/api/hooks/api_hooks/authHooks";
import {toast} from "sonner";
import {getErrorMessage} from "@/src/utils/getErrorMessage";
import routes from "@/src/constants/routes";
import {useRouter} from "next/navigation";
import {successMessage} from "@/src/utils/getSuccessMessage";
import AuthForm from "@/src/components/auth/form/AuthForm";
import FormItem from "@/src/components/auth/form/FormItem";
import PasswordInputField from "@/src/components/auth/form/PasswordInputField";
import Loader from "@/src/components/loader/Loader";


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
            onSuccess: async () => {
                toast.success(successMessage.REGISTER_SUCCESSFUL);
                window.location.replace(routes.EMAIL_SENT); // router.push doesn't work here sometimes
                // router.replace(routes.EMAIL_SENT);
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
        <>
            <Loader active={registerMutation.isPending} isFullScreen={true}/>

            <AuthForm
                onSubmit={handleRegister}
            >
                <FormItem>
                    <Label htmlFor='email'>E-Mail</Label>
                    <Input
                        id='email'
                        type='email'
                        required={true}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </FormItem>

                <FormItem>
                    <Label htmlFor='username'>Username</Label>
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

                <FormItem>
                    <Label htmlFor='repeat-password'>Passwort wiederholen</Label>
                    <PasswordInputField
                        id={'repeat-password'}
                        required={true}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </FormItem>

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
            </AuthForm>
        </>
    );
}