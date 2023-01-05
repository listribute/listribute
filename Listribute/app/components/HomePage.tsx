import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Card, Icon, ListItem, Text } from "@rneui/base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { RootStackParamList } from "./RootNavigation";
import { useActions, useAppState, useEffects } from "../overmind";
import { listributeRed } from "./colors";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

const HomePage: React.FC<Props> = ({ navigation }) => {
    const state = useAppState();
    const actions = useActions();
    const effects = useEffects();

    useEffect(() => {
        const subscription = effects.api.listsObservable.subscribe(
            actions.addList,
        );
        return () => {
            subscription.unsubscribe();
        };
    }, [actions.addList, effects.api.listsObservable]);

    const [isRefreshing, setIsRefreshing] = useState(false);

    const refresh = async () => {
        setIsRefreshing(true);
        await actions.refreshLists();
        setIsRefreshing(false);
    };

    const goToList = (listId?: number) => {
        navigation.navigate("List", listId != null ? { listId } : undefined);
    };

    const goToEditList = (listId: number) => {
        navigation.navigate("ListSettings", { listId });
    };

    return (
        <View style={style.container}>
            {state.lists.length > 0 && (
                <SwipeListView
                    data={state.lists}
                    keyExtractor={(_, index) => index.toString()}
                    refreshing={isRefreshing}
                    onRefresh={refresh}
                    renderItem={({ item: list }) => (
                        <ListItem
                            onPress={() => goToList(list.id)}
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
                                        actions.removeList(list.id);
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
                                        goToEditList(list.id);
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

            {state.lists.length === 0 && (
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
                        onPress={() => goToList()}
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
