import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Card, Icon, ListItem, Text } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";
import * as api from "../api";
import useAsyncEffect from "../hooks/useAsyncEffect";
import { List } from "../model/list";
import { User } from "../model/user";
import { listributeRed } from "./colors";
import Header from "./Header";

interface Props {
    user: User;
    onSelectList: (list: List) => void;
    onEditList: (list: List) => void;
}

const HomePage: React.FC<Props> = ({ user, onSelectList, onEditList }) => {
    const [lists, setLists] = useState<List[]>();

    useAsyncEffect(api.getAllLists, setLists, []);

    const addList = () => {
        onSelectList({
            name: new Date().toDateString(),
            wishList: false,
        });
    };

    const deleteList = async (list: List) => {
        if (lists) {
            const idx = lists.indexOf(list);
            if (idx > -1 && lists[idx].id) {
                await api.removeListForUser(lists[idx].id!);
            }
            setLists([...lists.slice(0, idx), ...lists.slice(idx + 1)]);
        }
    };

    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = async () => {
        setIsRefreshing(true);
        const updated = await api.getAllLists();
        setIsRefreshing(false);
        setLists(updated);
    };

    const openUserSettings = () => {
        // TODO: Open user settings
    };

    return (
        <View style={style.container}>
            <Header
                leftComponent={{
                    icon: "settings",
                    color: "white",
                    underlayColor: "transparent",
                    onPress: () => openUserSettings(),
                }}
                centerComponent={{
                    text: `Hi, ${user.username}`,
                    style: style.headerCenter,
                }}
                rightComponent={{
                    icon: "add",
                    color: "white",
                    underlayColor: "transparent",
                    onPress: () => addList(),
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
                            title={list.name}
                            leftIcon={{
                                name:
                                    list.subscribers &&
                                    list.subscribers.length > 1
                                        ? "person-add"
                                        : "person",
                            }}
                            onPress={() => onSelectList(list)}
                            bottomDivider
                            chevron
                        />
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
                                        deleteList(list);
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
                ></SwipeListView>
            )}

            {!lists && <Text>Loading...</Text>}

            {lists?.length === 0 && (
                <Card title="Welcome">
                    <Text style={style.welcomeText}>
                        You have no lists yet. Time to add one!
                    </Text>
                    <Button
                        buttonStyle={{ backgroundColor: listributeRed }}
                        icon={<Icon name="add" color="white" />}
                        title="Add new list"
                        onPress={() => addList()}
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
