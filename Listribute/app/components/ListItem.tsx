import React from "react";
import { View } from "react-native";
import * as RNE from "react-native-elements";
import * as api from "../api";
import { Item } from "../model/item";
import { listributeRed } from "./colors";

interface ListItemProps {
    username: string;
    item: Item;
    onItemChecked: (item: Item) => void;
}

export const ListItem: React.FC<ListItemProps> = ({
    username,
    item,
    onItemChecked,
}) => {
    const checkItem = (item: Item) => {
        const idx = item.checkedBy!.indexOf(username);
        if (idx > -1) {
            item.checkedBy!.splice(idx, 1);
            api.uncheckItem(item.id!);
        } else {
            item.checkedBy!.push(username);
            api.checkItem(item.id!);
        }
        onItemChecked(item);
    };

    return (
        <RNE.ListItem
            title={item.name}
            leftIcon={{
                name:
                    item.checkedBy && item.checkedBy.indexOf(username) > -1
                        ? "check-circle"
                        : item.checkedBy?.length
                        ? "radio-button-checked"
                        : "radio-button-unchecked",
                onPress: () => checkItem(item),
            }}
            bottomDivider
        />
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
    const deleteItem = async () => {
        onDeleteItem(item);

        if (item.id) await api.removeItem(item.id);
    };

    return (
        <View
            style={{
                alignItems: "flex-start",
                backgroundColor: listributeRed,
            }}
        >
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