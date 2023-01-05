import * as RNE from "@rneui/base";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Item } from "../model/item";
import { useAppState, useEffects } from "../overmind";
import { listributeRed } from "./colors";

interface ListItemProps {
    item: Item;
    checkItem: (item: Item) => void;
}

export const ListItem: React.FC<ListItemProps> = ({
    item,
    checkItem: checkItemProp,
}) => {
    const state = useAppState();
    const username = state.currentUser.username;

    const checkItem = useCallback(() => {
        checkItemProp(item);
    }, [checkItemProp, item]);

    return (
        <RNE.ListItem bottomDivider>
            <RNE.Icon
                name={
                    item.checkedBy.indexOf(username) > -1
                        ? "check-circle"
                        : item.checkedBy.length
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                }
                onPress={checkItem}
            />
            <RNE.ListItem.Content>
                <RNE.ListItem.Title>{item.name}</RNE.ListItem.Title>
            </RNE.ListItem.Content>
        </RNE.ListItem>
    );
};

interface HiddenListItemProps {
    item: Item;
    onDeleteItem: (item: Item) => void;
}

export const HiddenListItem: React.FC<HiddenListItemProps> = ({
    item,
    onDeleteItem,
}) => {
    useAppState();
    const effects = useEffects();

    const deleteItem = async () => {
        onDeleteItem(item);

        if (item.id) await effects.api.removeItem(item.id);
    };

    return (
        <View style={styles.hiddenButton}>
            <RNE.Button
                icon={{ name: "delete", color: "white" }}
                title="Delete"
                type="clear"
                buttonStyle={{ height: "100%" }}
                titleStyle={{ color: "white" }}
                onPress={() => deleteItem()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    hiddenButton: {
        alignItems: "flex-start",
        backgroundColor: listributeRed,
    },
});
