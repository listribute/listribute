import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";
import { RootStackParamList } from "../RootNavigation";
import { useActions, useAppState } from "../../overmind";
import AddUserInput from "./AddUserInput";
import NameInput from "./NameInput";
import UserList from "./UserList";
import WishListButton from "./WishListButton";
import { Button, Text } from "@rneui/base";

type Props = NativeStackScreenProps<RootStackParamList, "ListSettings">;

const ListSettings: React.FC<Props> = ({ route }) => {
    const state = useAppState();
    const actions = useActions();

    const list = state.listById[route.params.listId];
    const [name, setName] = useState(list.name);

    const [saveStatus, setSaveStatus] = useState({
        success: true,
        text: "\u00a0",
    });

    const save = useCallback(async () => {
        if (name !== list.name) {
            try {
                await actions.updateListName({
                    listId: list.id,
                    newName: name,
                });
                setSaveStatus({ success: true, text: "List name saved" });
            } catch (error: any) {
                setSaveStatus({
                    success: false,
                    text: `Server error(${error?.response?.status}). Try again later.`,
                });
            }
        }
    }, [name, list.name, list.id, actions]);

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
            <NameInput name={name} onChange={setName} />
            <Button
                title="Save name"
                icon={{
                    name: "save",
                    color: "white",
                }}
                onPress={save}
            />
            <Text style={saveStatus.success ? styles.success : styles.failure}>
                {saveStatus.text}
            </Text>
            <WishListButton
                isWishList={list.wishList}
                onSetWishList={setWishList}
            />
            <Text style={styles.subscribersText}>Subscribers:</Text>
            <AddUserInput onSubmit={addUser} />
            <UserList users={list.subscribers} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: "100%",
        paddingTop: 20,
        padding: 5,
        display: "flex",
    },
    success: {
        color: "green",
    },
    failure: {
        color: "red",
    },
    subscribersText: {
        marginTop: 30,
        fontSize: 18,
        textAlign: "center",
    },
});

export default ListSettings;
