import React, { useState } from "react";
import { Input } from "@rneui/base";
import { useAppState } from "../../overmind";

interface Props {
    onSubmit: (newName: string) => void;
}

const AddUserInput: React.FC<Props> = ({ onSubmit }) => {
    useAppState();

    const [newUser, setNewUser] = useState<string>();

    const submit = () => {
        if (newUser) onSubmit(newUser);
        setNewUser(undefined);
    };

    return (
        <Input
            placeholder="Add user"
            rightIcon={{ name: "add", onPress: submit }}
            onSubmitEditing={submit}
            onChangeText={setNewUser}
            value={newUser}
        />
    );
};

export default AddUserInput;
