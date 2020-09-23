import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import useBackButton from "../../hooks/useBackButton";
import { List } from "../../model/list";
import Header from ".././Header";
import * as api from "../../api";
import NameInput from "./NameInput";
import WishListCheckBox from "./WishListCheckBox";

interface Props {
    list: List;
    onBack: () => void;
}

const ListSettings: React.FC<Props> = ({ list: listProp, onBack }) => {
    useBackButton(onBack);

    const [list, setList] = useState(listProp);

    const setName = (newName: string) => {
        if (newName) {
            const updatedList = {
                ...list,
                name: newName,
            };
            // Fire and forget...
            // TODO: Handle errors
            api.updateList(updatedList);
            setList(updatedList);
        }
    };

    const setWishList = (isWishList: boolean) => {
        const updatedList = {
            ...list,
            wishList: isWishList,
        };
        // Fire and forget...
        // TODO: Handle errors
        api.updateList(updatedList);
        setList(updatedList);
    };

    return (
        <View style={styles.container}>
            <Header
                onBackButton={onBack}
                centerComponent={{
                    text: list.name,
                    style: { color: "white", fontSize: 18 },
                }}
            />
            <NameInput name={list.name} onChange={setName} />
            <WishListCheckBox
                isWishList={list.wishList}
                onChange={setWishList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
});

export default ListSettings;
