import React from "react";
import { Input } from "@rneui/base";

interface Props {
    name: string;
    onChange: (newName: string) => void;
}

const NameInput: React.FC<Props> = ({ name, onChange }) => {
    return (
        <Input
            placeholder="List name"
            leftIcon={{ name: "edit" }}
            onChangeText={newName => newName && onChange(newName)}
            defaultValue={name}
        />
    );
};

export default NameInput;
