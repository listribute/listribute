import React, { useEffect, useState } from "react";
import CommonEmailInput from "../EmailInput";

interface Props {
    email: string;
    onChange: (newEmail: string) => void;
}

const EmailInput: React.FC<Props> = ({ email: emailProp, onChange }) => {
    const [email, setEmail] = useState(emailProp);

    useEffect(() => {
        setEmail(emailProp);
    }, [emailProp]);

    return (
        <CommonEmailInput
            label="Email"
            placeholder="john@doe.tld"
            leftIcon={{ name: "email" }}
            onChangeText={onChange}
            value={email}
        />
    );
};

export default EmailInput;
