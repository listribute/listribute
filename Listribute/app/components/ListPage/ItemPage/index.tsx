import React from "react";
import { Text } from "react-native";
import { Item } from "../../../model/item";

interface Props {
    item: Item;
}

const ItemPage: React.FC<Props> = ({ item }) => {
    return <Text>{item.name}</Text>;
};

export default ItemPage;
