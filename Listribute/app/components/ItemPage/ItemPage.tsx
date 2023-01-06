import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Input, Text } from "@rneui/base";
import React, { Fragment, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useAppState, useEffects } from "../../overmind";
import { RootStackParamList } from "../RootNavigation";
import UserList from "./UserList";

type Props = NativeStackScreenProps<RootStackParamList, "Item">;

const ItemPage: React.FC<Props> = ({ route }) => {
    const state = useAppState();
    const effects = useEffects();

    const item = route.params.item;
    const list = state.listById[item.listId];

    const [name, setName] = useState(item.name);
    useEffect(() => setName(item.name), [item]);

    const [description, setDescription] = useState(item.description);
    useEffect(() => setDescription(item.description), [item]);

    const save = async () => {
        try {
            await effects.api.updateItem({ ...item, name, description });
            setSaveStatus({ success: true, text: "Item saved" });
        } catch (error: any) {
            switch (error?.response?.status) {
                default:
                    setSaveStatus({
                        success: false,
                        text: `Server error(${error?.response?.status}). Try again later.`,
                    });
            }
        }
    };

    const [saveStatus, setSaveStatus] = useState({
        success: true,
        text: "\u00a0",
    });

    return (
        <View style={styles.container}>
            <Input
                label="Name"
                placeholder="name"
                // leftIcon={{ name: "edit" }}
                onChangeText={setName}
                value={name}
                disabled
            />
            <Input
                multiline={true}
                label="Description"
                onChangeText={setDescription}
                value={description ?? ""}
            />
            <Button
                title="Save"
                icon={{
                    name: "save",
                    color: "white",
                }}
                onPress={save}
            />
            <Text style={saveStatus.success ? styles.success : styles.failure}>
                {saveStatus.text}
            </Text>
            {list.wishList || item.checkedBy.length === 0 ? null : (
                <Fragment>
                    <Text style={styles.checkedByTitle}>Checked by:</Text>
                    <UserList users={item.checkedBy} />
                </Fragment>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: "100%",
        paddingTop: 20,
        padding: 5,
    },
    checkedByTitle: {
        marginTop: 10,
        fontSize: 14,
    },
    success: {
        color: "green",
    },
    failure: {
        color: "red",
    },
});

export default ItemPage;
