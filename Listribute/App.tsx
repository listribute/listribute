import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import * as api from "./app/api";
import HomePage from "./app/components/HomePage";
import ListPage from "./app/components/ListPage";
import { List } from "./app/model/list";
import { User } from "./app/model/user";
import * as storage from "./app/storage";
import ListSettings from "./app/components/ListSettings";

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User>();
    const [currentList, setCurrentList] = useState<List>();
    const [editList, setEditList] = useState<List>();

    useEffect(() => {
        (async () => {
            // Look for user credentials in storage
            let credentials = await storage.getUser();
            if (!credentials) {
                // Create a new user automatically
                credentials = await api.createNewUser();
                // Store the new user's credentials
                storage.setUser(credentials);
            }
            // Initialize API client so it can re-authenticate automatically
            // when receiving a 401 due to session cookie being expired
            api.initialize(credentials);
            const user = await api.login();

            // Update state with new user
            setCurrentUser(user);
        })();
    }, []);

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
            ) : (
                <HomePage
                    user={currentUser}
                    onSelectList={list => setCurrentList(list)}
                    onEditList={list => setEditList(list)}
                />
            )}
        </SafeAreaView>
    );
};

export default App;
