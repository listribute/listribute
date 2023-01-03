import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import * as api from "./api";
import HomePage from "./components/HomePage";
import ListPage from "./components/ListPage";
import { List } from "./model/list";
import { User } from "./model/user";
import * as storage from "./storage";
import ListSettings from "./components/ListSettings";
import UserSettings from "./components/UserSettings";
import useAsyncEffect from "./hooks/useAsyncEffect";

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User>();
    const [currentList, setCurrentList] = useState<List>();
    const [editList, setEditList] = useState<List>();
    const [userSettingsOpen, setUserSettingsOpen] = useState(false);

    useAsyncEffect(
        async () => {
            // Look for user credentials in storage
            let credentials = await storage.getUser();
            if (!credentials) {
                // Create a new user automatically
                credentials = await api.createNewUser();
                // Store the new user's credentials
                storage.setUser(credentials);
            }
            const user = await api.login(credentials);
            return user;
        },
        setCurrentUser,
        [],
    );

    const switchUser = (user: User) => {
        storage.setUser(user);
        setCurrentUser(user);
    };

    return currentUser === undefined ? null : (
        <SafeAreaView>
            {currentList ? (
                <ListPage
                    username={currentUser.username}
                    list={currentList}
                    onBack={() => setCurrentList(undefined)}
                />
            ) : editList ? (
                <ListSettings
                    currentUser={currentUser.username}
                    list={editList}
                    onBack={() => setEditList(undefined)}
                />
            ) : userSettingsOpen ? (
                <UserSettings
                    user={currentUser}
                    onBack={() => setUserSettingsOpen(false)}
                    onSwitchUser={switchUser}
                />
            ) : (
                <HomePage
                    user={currentUser}
                    onSelectList={list => setCurrentList(list)}
                    onEditList={list => setEditList(list)}
                    onOpenUserSettings={() => setUserSettingsOpen(true)}
                />
            )}
        </SafeAreaView>
    );
};

export default App;
