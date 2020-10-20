import React, { useEffect, useState } from "react";
import { View } from "react-native";
import * as RNE from "react-native-elements";
import * as api from "../api";
import { Item } from "../model/item";
import { listributeRed } from "./colors";

interface ListItemProps {
    username: string;
    item: Item;
}

export const ListItem: React.FC<ListItemProps> = ({
    username,
    item: itemProp,
}) => {
    const [item, setItem] = useState(itemProp);
    useEffect(() => {
        setItem(itemProp);
    }, [itemProp]);

    const checkItem = (item: Item) => {
        const idx = item.checkedBy!.indexOf(username);
        if (idx > -1) {
            item.checkedBy!.splice(idx, 1);
            api.uncheckItem(item.id!).catch(() => {
                item.checkedBy!.push(username);
            });
        } else {
            item.checkedBy!.push(username);
            api.checkItem(item.id!).catch(() => {
                item.checkedBy!.pop();
            });
        }
        setItem({ ...item });
    };

    return (
        <RNE.ListItem bottomDivider>
            <RNE.Icon
                name={
                    item.checkedBy && item.checkedBy.indexOf(username) > -1
                        ? "check-circle"
                        : item.checkedBy?.length
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                }
                onPress={() => checkItem(item)}
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
