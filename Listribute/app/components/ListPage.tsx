import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Input } from "@rneui/base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Menu } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import useAsyncEffect from "../hooks/useAsyncEffect";
import { Item } from "../model/item";
import { List } from "../model/list";
import { useActions, useAppState, useEffects } from "../overmind";
import { HiddenListItem, ListItem } from "./ListItem";
import { RootStackParamList } from "./RootNavigation";

type Props = NativeStackScreenProps<RootStackParamList, "List">;

const ListPage: React.FC<Props> = ({ navigation, route }) => {
    const state = useAppState();
    const actions = useActions();
    const effects = useEffects();

    const [list, setList] = useState<List | null>(
        (route.params && state.listById[route.params.listId]) ?? null,
    );

    useEffect(() => {
        if (list == null) {
            let mounted = true;
            (async () => {
                const newList = await actions.createList(false);
                if (mounted) {
                    setList(newList);
                    navigation.setParams({ listId: newList.id });
                }
            })();

            return () => {
                mounted = false;
            };
        }
    }, [list, actions, navigation]);

    const [items, setItems] = useState<Item[] | null>(null);

    useAsyncEffect(
        () =>
            list != null
                ? effects.api.getListItems(list.id)
                : Promise.resolve(null),
        setItems,
        [list],
    );

    useEffect(() => {
        if (list == null) return;

        const subscription = effects.api
            .itemsObservable(list.id)
            .subscribe(setItems);

        return () => {
            subscription.unsubscribe();
        };
    }, [list, effects.api]);

    const [inputFocused, setInputFocused] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const inputRef = useRef<(Input & TextInput) | null>(null);

    const addItem = useCallback(
        async (blur: boolean) => {
            if (inputValue && list) {
                const item = await effects.api.createNewItem({
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
        },
        [inputValue, list, items, effects.api],
    );

    const [menuOpen, setMenuOpen] = useState(false);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = async () => {
        if (list) {
            setIsRefreshing(true);
            const updated = await effects.api.getListItems(list.id);
            setIsRefreshing(false);
            setItems(updated);
        }
    };

    const username = state.currentUser.username;

    const checkItem = (item: Item) => {
        const idx = item.checkedBy.indexOf(username);
        if (idx > -1) {
            item.checkedBy.splice(idx, 1);

            effects.api.uncheckItem(item.id).catch(() => {
                item.checkedBy.push(username);
                if (items) setItems([...items]);
            });
        } else {
            item.checkedBy.push(username);

            effects.api.checkItem(item.id).catch(() => {
                item.checkedBy.pop();
                if (items) setItems([...items]);
            });
        }

        // Trigger a rerender with a changed items list
        if (items) setItems([...items]);
    };

    const clearCheckmarks = useCallback(() => {
        items
            ?.filter(i => i.checkedBy.includes(username))
            .forEach(i => {
                const backup = i.checkedBy;
                i.checkedBy = [];
                // TODO: Await this call and handle potential failure
                effects.api.uncheckItem(i.id).catch(() => {
                    i.checkedBy = backup;
                    setItems([...items]);
                });
            });

        // Trigger a rerender with a changed items list
        if (items) setItems([...items]);
    }, [items, username, effects.api]);

    const deleteCheckedItems = useCallback(() => {
        items
            ?.filter(i => i.checkedBy.length)
            .forEach(i => {
                const idx = items.indexOf(i);
                items.splice(idx, 1);

                effects.api.removeItem(i.id).catch(() => {
                    items.push(i);
                    setItems([...items]);
                });
            });

        // Trigger a rerender with a changed items list
        if (items) setItems([...items]);
    }, [items, effects.api]);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () =>
                inputFocused ? (
                    <Button
                        icon={{
                            name: "add",
                            color: "white",
                        }}
                        type="clear"
                        onPress={() => addItem(true)}
                    />
                ) : (
                    <Menu
                        visible={menuOpen}
                        onDismiss={() => setMenuOpen(false)}
                        anchor={
                            <Button
                                icon={{
                                    name: "more-vert",
                                    color: "white",
                                }}
                                type="clear"
                                onPress={() => setMenuOpen(true)}
                            />
                        }>
                        <Menu.Item
                            title="Edit settings"
                            leadingIcon="pencil"
                            onPress={() => {
                                if (list?.id != null) {
                                    navigation.navigate("ListSettings", {
                                        listId: list.id,
                                    });
                                }
                                setMenuOpen(false);
                            }}
                            disabled={list?.id == null}
                        />
                        <Menu.Item
                            title="Clear my checkmarks"
                            leadingIcon="check-circle"
                            onPress={() => {
                                clearCheckmarks();
                                setMenuOpen(false);
                            }}
                        />
                        <Menu.Item
                            title="Delete checked items"
                            leadingIcon="delete"
                            onPress={() => {
                                deleteCheckedItems();
                                setMenuOpen(false);
                            }}
                        />
                    </Menu>
                ),
        });
    }, [
        navigation,
        addItem,
        inputFocused,
        menuOpen,
        clearCheckmarks,
        deleteCheckedItems,
        list?.id,
    ]);

    return (
        <View style={styles.container}>
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
                    data={items}
                    keyExtractor={item => item.id.toString()}
                    refreshing={isRefreshing}
                    onRefresh={refresh}
                    renderItem={({ item }) => (
                        <ListItem item={item} checkItem={checkItem} />
                    )}
                    renderHiddenItem={({ item, index }, rowMap) => (
                        <HiddenListItem
                            item={item}
                            onDeleteItem={() => {
                                rowMap[item.id.toString()].closeRow();
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

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
});

export default ListPage;
