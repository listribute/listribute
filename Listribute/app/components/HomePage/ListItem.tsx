import * as RNE from "@rneui/base";
import { Button } from "@rneui/base";
import React from "react";
import { StyleSheet, View } from "react-native";
import { List } from "../../model/list";
import { useAppState } from "../../overmind";
import { listributeRed } from "../../colors";

type ListItemProps = RNE.ListItemProps & {
    list: List;
};

export const ListItem: React.FC<ListItemProps> = ({ list, ...props }) => {
    useAppState();

    return (
        <RNE.ListItem bottomDivider {...props}>
            <RNE.Icon
                name={
                    list.wishList
                        ? "gift-outline"
                        : list.subscribers && list.subscribers.length > 1
                        ? "person-add"
                        : "person"
                }
                type={list.wishList ? "material-community" : undefined}
            />
            <RNE.ListItem.Content>
                <RNE.ListItem.Title>{list.name}</RNE.ListItem.Title>
            </RNE.ListItem.Content>
            <RNE.ListItem.Chevron />
        </RNE.ListItem>
    );
};

interface HiddenListItemProps {
    onDelete: () => void;
    onEdit: () => void;
}

export const HiddenListItem: React.FC<HiddenListItemProps> = ({
    onDelete,
    onEdit,
}) => {
    useAppState();

    return (
        <View style={styles.hiddenItemContainer}>
            <View style={styles.hiddenDelete}>
                <Button
                    icon={{ name: "delete", color: "white" }}
                    title="Delete"
                    type="clear"
                    buttonStyle={{ height: "100%" }}
                    titleStyle={{ color: "white" }}
                    onPress={() => onDelete()}
                />
            </View>
            <View style={styles.hiddenEdit}>
                <Button
                    icon={{ name: "edit" }}
                    title="Edit"
                    type="clear"
                    buttonStyle={{ height: "100%" }}
                    titleStyle={{ color: "darkgrey" }}
                    onPress={() => onEdit()}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    hiddenItemContainer: { display: "flex", flexDirection: "row" },
    hiddenDelete: {
        alignItems: "flex-start",
        backgroundColor: listributeRed,
        flex: 1,
    },
    hiddenEdit: { flex: 1, alignItems: "flex-end" },
});
