import React, { useState } from "react";
import { List } from "../model/list";
import Header from "./Header";
import { View } from "react-native";
import useBackButton from "../hooks/useBackButton";
import { Input } from "react-native-elements";

interface Props {
    list: List;
    onBack: () => void;
}

const ListSettingsPage: React.FC<Props> = ({ list, onBack }) => {
    useBackButton(onBack);

    const [tmpName, setTmpName] = useState(list.name);
    return (
        <View style={{ height: "100%" }}>
            <Header
                centerComponent={{
                    text: tmpName,
                    style: { color: "white", fontSize: 18 },
                }}
                rightComponent={{
                    icon: "save",
                    color: "white",
                    underlayColor: "transparent",
                }}
            />
            <Input
                placeholder="List name"
                leftIcon={{ name: "edit" }}
                // onBlur={() => checkValidName()}
                // onSubmitEditing={() => changeName(false)}
                onChangeText={setTmpName}
                value={tmpName}
            />
        </View>
    );
};

export default ListSettingsPage;
