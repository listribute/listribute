import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import useBackButton from "../../hooks/useBackButton";
import { List } from "../../model/list";
import Header from ".././Header";
import * as api from "../../api";
import NameInput from "./NameInput";
import WishListCheckBox from "./WishListCheckBox";
import AddUserInput from "./AddUserInput";
import UserList from "./UserList";

interface Props {
    currentUser: string;
    list: List;
    onBack: () => void;
}

const ListSettings: React.FC<Props> = ({
    currentUser,
    list: listProp,
    onBack,
}) => {
    useBackButton(onBack);

    const [list, setList] = useState(listProp);
    const [subscribers, setSubscribers] = useState(listProp.subscribers ?? []);

    const setName = async (newName: string) => {
        if (newName) {
            const updatedList = {
                ...list,
                name: newName,
            };

            try {
                await api.updateList(updatedList);
                setList(updatedList);
            } catch (err) {
                console.error(err);
                // TODO: Show error message
            }
        }
    };

    const setWishList = async (isWishList: boolean) => {
        const updatedList = {
            ...list,
            wishList: isWishList,
        };

        try {
            await api.updateList(updatedList);
            setList(updatedList);
        } catch (err) {
            console.error(err);
            // TODO: Show error message
        }
    };

    const addUser = async (username: string) => {
        if (username) {
            try {
                await api.addUserToList(list.id!, username);
                setSubscribers(subscribers.concat(username));
            } catch (err) {
                console.error(err);
                // TODO: Show error message
            }
        }
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
            <AddUserInput onSubmit={addUser} />
            <UserList currentUser={currentUser} users={subscribers} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
});

export default ListSettings;
