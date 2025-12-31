'use client'
import AuthForm from "@/src/components/auth/form/AuthForm";
import {FormEvent, useState} from "react";
import FormItem from "@/src/components/auth/form/FormItem";
import {Label} from "@workspace/ui/components/label";
import {Input} from "@workspace/ui/components/input";
import {Button} from "@workspace/ui/components/button";

export default function ResetPasswordForm() {

    const [username, setUsername] = useState("");

    const handlePasswordReset = async (e: FormEvent) => {
        e.preventDefault();


    };

    return (
        <AuthForm
            onSubmit={handlePasswordReset}
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

            <Button type={'submit'}>
                E-Mail senden!
            </Button>
        </AuthForm>
    );
}