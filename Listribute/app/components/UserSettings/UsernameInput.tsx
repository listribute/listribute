import React, { useEffect, useState } from "react";
import { Input } from "@rneui/base";

interface Props {
    username: string;
    conflicting: boolean;
    onChange: (newUsername: string) => void;
}

const UsernameInput: React.FC<Props> = ({
    username: usernameProp,
    conflicting,
    onChange,
}) => {
    const [username, setUsername] = useState(usernameProp);

    useEffect(() => {
        setUsername(usernameProp);
    }, [usernameProp]);

    return (
        <Input
            label="Username"
            placeholder="username"
            leftIcon={{ name: "person" }}
            onChangeText={onChange}
            value={username}
            errorMessage={conflicting ? "Username is taken" : undefined}
        />
    );
};

export default UsernameInput;
