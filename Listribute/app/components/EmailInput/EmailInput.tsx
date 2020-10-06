import React, { forwardRef, useEffect, useRef, useState } from "react";
import { Input, InputProps } from "react-native-elements";

interface Props extends InputProps {
    forwardedRef:
        | ((instance: Input | null) => void)
        | React.MutableRefObject<Input | null>
        | null;
}

const EmailInput: React.FC<Props> = ({ forwardedRef, ...props }) => {
    const [emailValid, setEmailValid] = useState(true);

    const [inputRef, setInputRef] = useState<Input | null>(null);
    useEffect(() => {
        if (forwardedRef != null) {
            if (typeof forwardedRef === "function") forwardedRef(inputRef);
            else forwardedRef.current = inputRef;
        }
        if (inputRef) {
            // TODO: Add event listener and validate input
        }
    }, [inputRef]);

    return (
        <Input
            ref={setInputRef}
            errorMessage={emailValid ? undefined : "Please enter valid email"}
            {...props}
        />
    );
};

const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailPattern.test(email);
};

export default forwardRef<Input, InputProps>((props, ref) => (
    <EmailInput forwardedRef={ref} {...props} />
));
