import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Card, Icon, Text } from "@rneui/base";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useActions, useAppState, useEffects } from "../../overmind";
import { listributeRed } from "../../colors";
import { RootStackParamList } from "../RootNavigation";
import { HiddenListItem, ListItem } from "./ListItem";

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
        <View style={styles.container}>
            {state.lists.length > 0 && (
                <SwipeListView
                    data={state.lists}
                    keyExtractor={list => list.id.toString()}
                    refreshing={isRefreshing}
                    onRefresh={refresh}
                    renderItem={({ item: list }) => (
                        <ListItem list={list} goToList={goToList} />
                    )}
                    renderHiddenItem={({ item: list }, rowMap) => (
                        <HiddenListItem
                            onEdit={() => {
                                goToEditList(list.id);
                                rowMap[list.id.toString()].closeRow();
                            }}
                            onDelete={() => {
                                actions.removeList(list.id);
                                rowMap[list.id.toString()].closeRow();
                            }}
                        />
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
                    <Text style={styles.welcomeText}>
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

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
    welcomeText: { marginBottom: 10 },
});

export default HomePage;
