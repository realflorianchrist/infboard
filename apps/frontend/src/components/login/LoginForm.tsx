'use client'
import {Avatar, AvatarFallback, AvatarImage} from "@workspace/ui/components/avatar";
import {IoIosPerson} from "react-icons/io";
import {Input} from "@workspace/ui/components/input";
import {Label} from "@workspace/ui/components/label";
import {Button} from "@workspace/ui/components/button";
import {useState} from "react";

export default function LoginForm() {

    const [isRegister, setIsRegister] = useState(false);

    return (
        <div className={'flex flex-col items-center justify-center gap-10'}>
            <Avatar className={'w-20 h-20'}>
                <AvatarFallback>
                    <IoIosPerson className={'w-14 h-14'}/>
                </AvatarFallback>
            </Avatar>
            <div className={'flex flex-col gap-4 w-full'}>
                <div className={'input-group'}>
                    <Label htmlFor='username'>Username / E-Mail</Label>
                    <Input id='username'/>
                </div>
                <div className={'input-group'}>
                    <Label htmlFor='password'>Passwort</Label>
                    <Input id='password' type='password'/>
                </div>
                {isRegister ? (
                    <div className={'input-group'}>
                        <Label htmlFor='password'>Passwort</Label>
                        <Input id='password' type='password'/>
                    </div>
                ) : (
                    <div className={'flex flex-col items-start'}>
                        <Button variant={'link'} className={'p-0'}>Passwort vergessen?</Button>
                    </div>
                )}
                <Button>
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
                        variant={'link'}
                        className={'p-0 font-bold'}
                        onClick={() => setIsRegister(!isRegister)}
                    >
                        {isRegister ? 'Login' : 'Registrieren'}
                    </Button>
                </div>
            </div>
        </div>
    );
}