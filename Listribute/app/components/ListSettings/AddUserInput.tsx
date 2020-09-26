import React, { useState } from "react";
import { EventEmitter } from "react-native";
import { Input } from "react-native-elements";

interface Props {
    onSubmit: (newName: string) => void;
}

const AddUserInput: React.FC<Props> = ({ onSubmit }) => {
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
