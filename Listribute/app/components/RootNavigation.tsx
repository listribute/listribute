import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "@rneui/base";
import React from "react";
import { StyleSheet } from "react-native";
import { useAppState } from "../overmind";
import { listributeRed } from "../colors";
import HomePage from "./HomePage";
import ListPage from "./ListPage";
import ListSettings from "./ListSettings";
import UserSettings from "./UserSettings";
import RecoverUser from "./UserSettings/RecoverUser";
import ItemPage from "./ItemPage";
import { Item } from "../model/item";

export type RootStackParamList = {
    Home: undefined;
    List: { listId: number } | undefined;
    ListSettings: { listId: number };
    Item: { item: Item };
    UserSettings: undefined;
    RecoverUser: undefined;
};

const RootNavigation: React.FC = () => {
    const state = useAppState();

    const Stack = createNativeStackNavigator<RootStackParamList>();

    return !state.initialized ? null : (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: styles.headerStyle,
                    headerTitleStyle: styles.headerTitleStyle,
                    headerTintColor: "white",
                    contentStyle: styles.contentStyle,
                }}>
                <Stack.Screen
                    name="Home"
                    component={HomePage}
                    options={({ navigation }) => ({
                        headerLeft: () => (
                            <Button
                                icon={{ name: "settings", color: "white" }}
                                type="clear"
                                onPress={() =>
                                    navigation.navigate("UserSettings")
                                }
                            />
                        ),
                        headerRight: () => (
                            <Button
                                icon={{ name: "add", color: "white" }}
                                type="clear"
                                onPress={() => navigation.navigate("List")}
                            />
                        ),
                    })}
                />
                <Stack.Screen
                    name="List"
                    component={ListPage}
                    options={({ route }) => ({
                        title:
                            route.params &&
                            state.listById[route.params.listId]?.name,
                    })}
                />
                <Stack.Screen
                    name="ListSettings"
                    component={ListSettings}
                    options={{
                        title: "List settings",
                    }}
                />
                <Stack.Screen
                    name="Item"
                    component={ItemPage}
                    options={({ route }) => ({
                        title: route.params.item.name,
                    })}
                />
                <Stack.Screen
                    name="UserSettings"
                    component={UserSettings}
                    options={{
                        title: "User settings",
                    }}
                />
                <Stack.Screen
                    name="RecoverUser"
                    component={RecoverUser}
                    options={{
                        title: "Recover user",
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: listributeRed,
    },
    headerTitleStyle: {
        fontSize: 18,
    },
    contentStyle: {
        backgroundColor: "white",
    },
});

export default RootNavigation;
