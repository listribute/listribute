import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button } from "@rneui/base";
import React from "react";
import { listributeRed } from "./colors";
import HomePage from "./HomePage";
import ListPage from "./ListPage";
import ListSettings from "./ListSettings";
import UserSettings from "./UserSettings";
import { useAppState } from "../overmind";

export type RootStackParamList = {
    Home: undefined;
    List: { listId: number } | undefined;
    ListSettings: { listId: number };
    UserSettings: undefined;
};

const RootNavigation: React.FC = () => {
    const state = useAppState();

    const Stack = createNativeStackNavigator<RootStackParamList>();

    return !state.initialized ? null : (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: listributeRed,
                    },
                    headerTitleStyle: {
                        fontSize: 18,
                    },
                    headerTintColor: "white",
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
                    options={({ route }) => ({
                        title: state.listById[route.params.listId].name,
                    })}
                />
                <Stack.Screen
                    name="UserSettings"
                    component={UserSettings}
                    options={{
                        title: "User settings",
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigation;
