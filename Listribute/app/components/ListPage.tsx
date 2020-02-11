import React, { useEffect, useState } from "react";
import { Platform, Text, View } from "react-native";
import { Header, Input } from "react-native-elements";
import { SwipeListView } from "react-native-swipe-list-view";
import * as api from "../api";
import useBackButton from "../hooks/useBackButton";
import { Item } from "../model/item";
import { List } from "../model/list";
import { listributeRed } from "./colors";
import { HiddenListItem, ListItem } from "./ListItem";

interface Props {
    username: string;
    list: List;
    onBack: () => void;
}

const ListPage: React.FC<Props> = ({ username, list: listProp, onBack }) => {
    useBackButton(onBack);

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

    const [inputRef, setInputRef] = useState<Input>();

    const addItem = async (blur: boolean) => {
        if (inputValue && list.id) {
            const item = await api.createNewItem({
                name: inputValue,
                listId: list.id,
                order: 1,
            });

            setItems([item, ...(items ?? [])]);

            if (inputRef && blur) {
                inputRef.blur();
            }
        }
        setInputValue("");
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
                ref={input => input && setInputRef(input)}
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
                            username={username}
                            item={item}
                            onItemChecked={() => setItems(items.slice(0))}
                        />
                    )}
                    renderHiddenItem={({ item, index }, rowMap) => (
                        <HiddenListItem
                            item={item}
                            onDeleteItem={() => {
                                rowMap[index.toString()].closeRow();
                                items.splice(index, 1);
                                setItems(items.slice(0));
                            }}
                        />
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
