import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import * as api from "./app/api";
import HomePage from "./app/components/HomePage";
import ListPage from "./app/components/ListPage";
import { List } from "./app/model/list";
import { User } from "./app/model/user";
import * as storage from "./app/storage";

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User>();
    const [currentList, setCurrentList] = useState<List>();

    useEffect(() => {
        (async () => {
            // Look for user credentials in storage
            let user = await storage.getUser();
            if (!user) {
                // Create a new user automatically
                user = await api.createNewUser();
                // Store the new user's credentials
                storage.setUser(user);
            }
            // Initialize API client so it can re-authenticate automatically
            // when receiving a 401
            user = await api.initialize(user);
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
            ) : (
                <HomePage
                    user={currentUser}
                    onSelectList={list => setCurrentList(list)}
                />
            )}
        </SafeAreaView>
    );
};

export default App;
