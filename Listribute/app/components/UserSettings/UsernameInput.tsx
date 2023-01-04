import { Input } from "@rneui/base";
import React, { useEffect, useState } from "react";
import { useAppState } from "../../overmind";

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
    useAppState();

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
