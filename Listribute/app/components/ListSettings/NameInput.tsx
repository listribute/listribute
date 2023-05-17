import { Input } from "@rneui/base";
import React from "react";
import { useAppState } from "../../overmind";

interface Props {
    name: string;
    onChange: (newName: string) => void;
}

const NameInput: React.FC<Props> = ({ name, onChange }) => {
    useAppState();

    return (
        <Input
            label="List name"
            placeholder="Some list"
            leftIcon={{ name: "edit" }}
            onChangeText={newName => newName && onChange(newName)}
            defaultValue={name}
        />
    );
};

export default NameInput;
