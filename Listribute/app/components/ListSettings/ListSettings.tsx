import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, View } from "react-native";
import { RootStackParamList } from "../RootNavigation";
import { useActions, useAppState } from "../../overmind";
import AddUserInput from "./AddUserInput";
import NameInput from "./NameInput";
import UserList from "./UserList";
import WishListCheckBox from "./WishListCheckBox";

type Props = NativeStackScreenProps<RootStackParamList, "ListSettings">;

const ListSettings: React.FC<Props> = ({ route }) => {
    const state = useAppState();
    const actions = useActions();

    const list = state.listById[route.params.listId];

    const setName = async (newName: string) => {
        if (newName) {
            try {
                await actions.updateListName({ listId: list.id, newName });
            } catch (err) {
                console.error(err);
                // TODO: Show error message
            }
        }
    };

    const setWishList = async () => {
        try {
            await actions.setAsWishList(list.id);
        } catch (err) {
            console.error(err);
            // TODO: Show error message
        }
    };

    const addUser = async (username: string) => {
        if (username) {
            try {
                await actions.addUserToList({ listId: list.id, username });
            } catch (err) {
                console.error(err);
                // TODO: Show error message
            }
        }
    };

    return (
        <View style={styles.container}>
            <NameInput name={list.name} onChange={setName} />
            <WishListCheckBox
                isWishList={list.wishList}
                onSetWishList={setWishList}
            />
            <AddUserInput onSubmit={addUser} />
            <UserList users={list.subscribers} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
});

export default ListSettings;
