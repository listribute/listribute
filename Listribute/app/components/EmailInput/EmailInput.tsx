import { Input, InputProps } from "@rneui/base";
import React, { forwardRef, useState } from "react";
import { TextInput } from "react-native";
import { useAppState } from "../../overmind";

interface Props extends InputProps {
    forwardedRef: React.ForwardedRef<Input & TextInput>;
}

const EmailInput: React.FC<Props> = ({ forwardedRef, ...props }) => {
    useAppState();

    const [emailValid, setEmailValid] = useState(true);

    return (
        <Input
            {...props}
            ref={forwardedRef}
            errorMessage={
                props.errorMessage ??
                (emailValid ? undefined : "Please enter a valid email address")
            }
            onChangeText={text => {
                setEmailValid(validateEmail(text));
                props.onChangeText?.(text);
            }}
        />
    );
};

const validateEmail = (email: string) => {
    const emailPattern =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return emailPattern.test(email);
};

export default forwardRef<Input & TextInput, InputProps>((props, ref) => (
    <EmailInput forwardedRef={ref} {...props} />
));
