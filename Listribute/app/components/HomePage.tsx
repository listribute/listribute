import { Button, Card, Icon, ListItem, Text } from "@rneui/base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { listsObservable } from "../api";
import { List } from "../model/list";
import { User } from "../model/user";
import { listributeRed } from "./colors";
import Header from "./Header";

interface Props {
    user: User;
    lists: List[];
    addList: (list: List) => void;
    removeList: (list: List) => void;
    refreshLists: () => Promise<void>;
    onSelectList: (list: List) => void;
    onEditList: (list: List) => void;
    onOpenUserSettings: () => void;
}

const HomePage: React.FC<Props> = ({
    user,
    lists,
    addList,
    removeList,
    refreshLists,
    onSelectList,
    onEditList,
    onOpenUserSettings,
}) => {
    useEffect(() => {
        const subscription = listsObservable.subscribe(addList);
        return () => {
            subscription.unsubscribe();
        };
    }, [addList]);

    const createList = () => {
        onSelectList({
            name: new Date().toDateString(),
            wishList: false,
        });
    };

    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = async () => {
        setIsRefreshing(true);
        await refreshLists();
        setIsRefreshing(false);
    };

    return (
        <View style={style.container}>
            <Header
                leftComponent={{
                    icon: "settings",
                    color: "white",
                    onPress: onOpenUserSettings,
                }}
                centerComponent={{
                    text: `Hi, ${user.username}`,
                    style: style.headerCenter,
                }}
                rightComponent={{
                    icon: "add",
                    color: "white",
                    onPress: createList,
                }}
            />

            {lists && lists.length > 0 && (
                <SwipeListView
                    useFlatList
                    data={lists}
                    keyExtractor={(_, index) => index.toString()}
                    refreshing={isRefreshing}
                    onRefresh={refresh}
                    renderItem={({ item: list }) => (
                        <ListItem
                            onPress={() => onSelectList(list)}
                            bottomDivider>
                            <Icon
                                name={
                                    list.subscribers &&
                                    list.subscribers.length > 1
                                        ? "person-add"
                                        : "person"
                                }
                            />
                            <ListItem.Content>
                                <ListItem.Title>{list.name}</ListItem.Title>
                            </ListItem.Content>
                            <ListItem.Chevron />
                        </ListItem>
                    )}
                    renderHiddenItem={({ item: list, index }, rowMap) => (
                        <View style={style.hiddenItemContainer}>
                            <View style={style.hiddenDelete}>
                                <Button
                                    icon={{ name: "delete", color: "white" }}
                                    title="Delete"
                                    type="clear"
                                    buttonStyle={{ height: "100%" }}
                                    titleStyle={{ color: "white" }}
                                    onPress={() => {
                                        rowMap[index.toString()].closeRow();
                                        removeList(list);
                                    }}
                                />
                            </View>
                            <View style={style.hiddenEdit}>
                                <Button
                                    icon={{ name: "edit" }}
                                    title="Edit"
                                    type="clear"
                                    buttonStyle={{ height: "100%" }}
                                    titleStyle={{ color: "darkgrey" }}
                                    onPress={() => {
                                        rowMap[index.toString()].closeRow();
                                        onEditList(list);
                                    }}
                                />
                            </View>
                        </View>
                    )}
                    stopLeftSwipe={200}
                    stopRightSwipe={-200}
                    friction={100}
                    tension={150}
                    leftOpenValue={150}
                    rightOpenValue={-150}
                />
            )}

            {!lists && <Text>Loading...</Text>}

            {lists?.length === 0 && (
                <Card>
                    <Card.Title>Welcome</Card.Title>
                    <Card.Divider />
                    <Text style={style.welcomeText}>
                        You have no lists yet. Time to add one!
                    </Text>
                    <Button
                        buttonStyle={{ backgroundColor: listributeRed }}
                        icon={<Icon name="add" color="white" />}
                        title="Add new list"
                        onPress={createList}
                    />
                </Card>
            )}
        </View>
    );
};

const style = StyleSheet.create({
    container: {
        height: "100%",
    },
    headerCenter: { color: "white", fontSize: 18 },
    hiddenItemContainer: { display: "flex", flexDirection: "row" },
    hiddenDelete: {
        alignItems: "flex-start",
        backgroundColor: listributeRed,
        flex: 1,
    },
    hiddenEdit: { flex: 1, alignItems: "flex-end" },
    welcomeText: { marginBottom: 10 },
});

export default HomePage;
