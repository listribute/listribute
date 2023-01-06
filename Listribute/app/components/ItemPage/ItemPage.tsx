import React from "react";
import { Text } from "react-native";
import { Item } from "../../model/item";
import { useAppState } from "../../overmind";

interface Props {
    item: Item;
}

const ItemPage: React.FC<Props> = ({ item }) => {
    useAppState();

    return <Text>{item.name}</Text>;
};

export default ItemPage;
