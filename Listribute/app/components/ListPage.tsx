import React, { useEffect, useState } from "react";
import { BackHandler, Platform, Text, View } from "react-native";
import { Button, Header, Input, ListItem } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";
import * as api from "../api";
import { Item } from "../model/item";
import { List } from "../model/list";
import { listributeRed } from "./colors";

interface Props {
    username: string;
    list: List;
    onBack: () => void;
}

const ListPage: React.FC<Props> = ({ username, list: listProp, onBack }) => {
    // Handle back button on Android
    useEffect(() => {
        const listener = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                onBack();
                return true;
            },
        );
        return () => {
            listener.remove();
        };
    }, []);

    const [list, setList] = useState(listProp);

    useEffect(() => {
        if (!list.id) {
            (async () => {
                setList(await api.createNewList(list.wishList));
            })();
        }
    }, []);

    const [items, setItems] = useState<Item[]>();

    useEffect(() => {
        if (list.id) {
            (async () => {
                const items = await api.getListItems(list.id!);
                setItems(items);
            })();

            // TODO: Return clean up to cancel ongoing request
        }
    }, [list.id]);

    const [inputFocused, setInputFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const [ref, setRef] = useState<Input>();

    const addItem = async (blur: boolean) => {
        if (inputValue && list.id) {
            const item = await api.createNewItem({
                name: inputValue,
                listId: list.id,
                order: 1,
            });

            setItems([item, ...(items ?? [])]);

            if (ref && blur) {
                ref.blur();
            }
        }
        setInputValue("");
    };

    const deleteItem = async (item: Item) => {
        if (items) {
            const idx = items.indexOf(item);
            if (idx > -1 && items[idx].id) {
                await api.removeItem(items[idx].id!);
            }
            setItems([...items.slice(0, idx), ...items.slice(idx + 1)]);
        }
    };

    const checkItem = (item: Item) => {
        const idx = item.checkedBy!.indexOf(username);
        if (idx > -1) {
            item.checkedBy!.splice(idx, 1);
            api.uncheckItem(item.id!);
        } else {
            item.checkedBy!.push(username);
            api.checkItem(item.id!);
        }
        setItems(items!.slice(0));
    };

    const toggleMoreMenu = () => {};

    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = async () => {
        if (list.id) {
            setIsRefreshing(true);
            const updated = await api.getListItems(list.id);
            setIsRefreshing(false);
            setItems(updated);
        }
    };

    return (
        <View style={{ height: "100%" }}>
            <Header
                statusBarProps={{
                    translucent: true,
                }}
                containerStyle={Platform.select({
                    android:
                        Platform.Version <= 20
                            ? { paddingTop: 0, height: 56 }
                            : {},
                })}
                backgroundColor={listributeRed}
                leftComponent={
                    Platform.OS !== "ios"
                        ? undefined
                        : {
                              icon: "arrow-back",
                              color: "white",
                              onPress: onBack,
                          }
                }
                centerComponent={{
                    text: list.name,
                    style: { color: "white", fontSize: 18 },
                }}
                rightComponent={{
                    icon: inputFocused ? "add" : "more-vert",
                    color: "white",
                    underlayColor: "transparent",
                    onPress: () =>
                        inputFocused ? addItem(true) : toggleMoreMenu(),
                }}
            />
            <Input
                ref={input => input && setRef(input)}
                placeholder="New item"
                leftIcon={{ name: "edit" }}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onSubmitEditing={() => addItem(false)}
                blurOnSubmit={false}
                onChangeText={setInputValue}
                value={inputValue}
            />

            {items && (
                <SwipeListView
                    useFlatList
                    data={items}
                    keyExtractor={(_, index) => index.toString()}
                    refreshing={isRefreshing}
                    onRefresh={refresh}
                    renderItem={({ item }) => (
                        <ListItem
                            title={item.name}
                            leftIcon={{
                                name:
                                    item.checkedBy &&
                                    item.checkedBy.indexOf(username) > -1
                                        ? "check-circle"
                                        : item.checkedBy?.length
                                        ? "radio-button-checked"
                                        : "radio-button-unchecked",
                                onPress: () => checkItem(item),
                            }}
                            bottomDivider
                        />
                    )}
                    renderHiddenItem={({ item, index }, rowMap) => (
                        <View
                            style={{
                                alignItems: "flex-start",
                                backgroundColor: listributeRed,
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
                                    deleteItem(item);
                                }}
                            />
                        </View>
                    )}
                    friction={100}
                    tension={150}
                    leftOpenValue={150}
                    disableLeftSwipe
                ></SwipeListView>
            )}

            {!items && <Text>Loading...</Text>}
        </View>
    );
};

export default ListPage;
