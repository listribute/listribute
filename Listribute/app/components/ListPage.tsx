import React, { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Input } from "@rneui/base";
import { SwipeListView } from "react-native-swipe-list-view";
import * as api from "../api";
import useBackButton from "../hooks/useBackButton";
import { Item } from "../model/item";
import { List } from "../model/list";
import { HiddenListItem, ListItem } from "./ListItem";
import Header from "./Header";
import useAsyncEffect from "../hooks/useAsyncEffect";
import { itemsObservable } from "../api";

interface Props {
    username: string;
    list: List;
    onNewList: (list: List) => void;
    onBack: () => void;
}

const ListPage: React.FC<Props> = ({
    username,
    list: listProp,
    onNewList,
    onBack,
}) => {
    useBackButton(onBack);

    const [list, setList] = useState(listProp);

    useEffect(
        () => {
            if (!list.id) {
                let mounted = true;
                (async () => {
                    const newList = await api.createNewList(list.wishList);

                    onNewList(newList);

                    if (mounted) setList(newList);
                })();

                return () => {
                    mounted = false;
                };
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const [items, setItems] = useState<Item[]>();

    useAsyncEffect(
        () =>
            list.id ? api.getListItems(list.id) : Promise.resolve(undefined),
        setItems,
        [list.id],
    );

    useEffect(() => {
        if (!list.id) return;

        const subscription = itemsObservable(list.id).subscribe(setItems);
        return () => {
            subscription.unsubscribe();
        };
    }, [list.id]);

    const [inputFocused, setInputFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const inputRef = useRef<(Input & TextInput) | null>(null);

    const addItem = async (blur: boolean) => {
        if (inputValue && list.id) {
            const item = await api.createNewItem({
                name: inputValue,
                listId: list.id,
                order: 1,
            });

            setItems([item, ...(items ?? [])]);

            if (inputRef.current && blur) {
                inputRef.current.blur();
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
                onBackButton={onBack}
                centerComponent={{
                    text: list.name,
                    style: { color: "white", fontSize: 18 },
                }}
                rightComponent={{
                    icon: inputFocused ? "add" : "more-vert",
                    color: "white",
                    onPress: () =>
                        inputFocused ? addItem(true) : toggleMoreMenu(),
                }}
            />
            <Input
                ref={inputRef}
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
                        <ListItem username={username} item={item} />
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
                />
            )}

            {!items && <Text>Loading...</Text>}
        </View>
    );
};

export default ListPage;
