import {InputGroup, InputGroupAddon, InputGroupInput} from "@workspace/ui/components/input-group";
import {BiHide, BiShowAlt} from "react-icons/bi";
import {useState} from "react";

export default function PasswordInputField(props: Omit<React.ComponentProps<"input">, 'type'>) {

    const [isPasswordHidden, setIsPasswordHidden] = useState(true);

    return (
        <InputGroup>
            <InputGroupInput
                type={isPasswordHidden ? 'password' : 'text'}
                {...props}
            />
            <InputGroupAddon
                align="inline-end"
                className={'cursor-pointer'}
                onClick={() => setIsPasswordHidden(!isPasswordHidden)}
            >
                {isPasswordHidden ? (<BiShowAlt/>) : (<BiHide/>)}
            </InputGroupAddon>
        </InputGroup>
    );
}