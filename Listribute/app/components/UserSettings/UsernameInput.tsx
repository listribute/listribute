import React, { useEffect, useState } from "react";
import { Input } from "react-native-elements";

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
            leftIcon={{ name: "edit" }}
            onChangeText={onChange}
            value={username}
            errorMessage={conflicting ? "Username is taken" : undefined}
        />
    );
};

export default UsernameInput;
