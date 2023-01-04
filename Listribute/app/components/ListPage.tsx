import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Input } from "@rneui/base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { RootStackParamList } from "./RootNavigation";
import useAsyncEffect from "../hooks/useAsyncEffect";
import { Item } from "../model/item";
import { List } from "../model/list";
import { useActions, useAppState, useEffects } from "../overmind";
import { HiddenListItem, ListItem } from "./ListItem";

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

    const toggleMoreMenu = () => {};

    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = async () => {
        if (list) {
            setIsRefreshing(true);
            const updated = await effects.api.getListItems(list.id);
            setIsRefreshing(false);
            setItems(updated);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    icon={{
                        name: inputFocused ? "add" : "more-vert",
                        color: "white",
                    }}
                    type="clear"
                    onPress={() =>
                        inputFocused ? addItem(true) : toggleMoreMenu()
                    }
                />
            ),
        });
    }, [navigation, addItem, inputFocused]);

    return (
        <View style={{ height: "100%" }}>
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
                    renderItem={({ item }) => <ListItem item={item} />}
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
