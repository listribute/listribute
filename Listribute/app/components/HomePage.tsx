import React, { useEffect, useState } from "react";
import { Platform, View } from "react-native";
import { Button, Card, Icon, ListItem, Text } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";
import * as api from "../api";
import { List } from "../model/list";
import { User } from "../model/user";
import { listributeRed } from "./colors";
import Header from "./Header";

interface Props {
    user: User;
    onSelectList: (list: List) => void;
}

const HomePage: React.FC<Props> = ({ user, onSelectList }) => {
    const [lists, setLists] = useState<List[]>();

    useEffect(() => {
        (async () => {
            const lists = await api.getAllLists();
            setLists(lists);
        })();

        // TODO: Return clean up to cancel ongoing request
    }, []);

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

    const editList = (list: List) => {
        // TODO: Open list edit page
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
        <View style={{ height: "100%" }}>
            <Header
                leftComponent={{
                    icon: "settings",
                    color: "white",
                    underlayColor: "transparent",
                    onPress: () => openUserSettings(),
                }}
                centerComponent={{
                    text: `Hi, ${user.username}`,
                    style: { color: "white", fontSize: 18 },
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
                        <View style={{ display: "flex", flexDirection: "row" }}>
                            <View
                                style={{
                                    alignItems: "flex-start",
                                    backgroundColor: listributeRed,
                                    flex: 1,
                                }}
                            >
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
                            <View style={{ flex: 1, alignItems: "flex-end" }}>
                                <Button
                                    icon={{ name: "edit" }}
                                    title="Edit"
                                    type="clear"
                                    buttonStyle={{ height: "100%" }}
                                    titleStyle={{ color: "darkgrey" }}
                                    onPress={() => {
                                        rowMap[index.toString()].closeRow();
                                        editList(list);
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
                    <Text style={{ marginBottom: 10 }}>
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

export default HomePage;
