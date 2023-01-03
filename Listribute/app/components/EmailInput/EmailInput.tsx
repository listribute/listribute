import React, { forwardRef, useEffect, useState } from "react";
import { Input, InputProps } from "@rneui/base";

interface Props extends InputProps {
    forwardedRef:
        | ((instance: Input | null) => void)
        | React.MutableRefObject<Input | null>
        | null;
}

const EmailInput: React.FC<Props> = ({ forwardedRef, ...props }) => {
    const [emailValid, _setEmailValid] = useState(true);

    const [inputRef, setInputRef] = useState<Input | null>(null);
    useEffect(() => {
        if (forwardedRef != null) {
            if (typeof forwardedRef === "function") forwardedRef(inputRef);
            else forwardedRef.current = inputRef;
        }
        if (inputRef) {
            // TODO: Add event listener and validate input
        }
    }, [forwardedRef, inputRef]);

    return (
        <Input
            {...props}
            ref={(input: any) => setInputRef(input)}
            errorMessage={emailValid ? undefined : "Please enter valid email"}
        />
    );
};

// const validateEmail = (email: string) => {
//     const emailPattern =
//         /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//     return emailPattern.test(email);
// };

export default forwardRef<Input, InputProps>((props, ref) => (
    <EmailInput forwardedRef={ref} {...props} />
));
