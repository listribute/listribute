import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import { login } from "./app/api";
import HomePage from "./app/components/HomePage";
import ListPage from "./app/components/ListPage";
import { List } from "./app/model/list";
import { User } from "./app/model/user";

const App: React.FC = () => {
    const [user, setUser] = useState<User>();
    const [currentList, setCurrentList] = useState<List>();

    useEffect(() => {
        (async () => {
            // TODO: Get credentials from storage
            const user = await login({
                username: "listribute_1536",
                password: "68793008a978",
            });
            setUser(user);
        })();
    }, []);

    return user === undefined ? null : (
        <SafeAreaView>
            {currentList ? (
                <ListPage
                    username={user.username}
                    list={currentList}
                    onBack={() => setCurrentList(undefined)}
                />
            ) : (
                <HomePage
                    user={user}
                    onSelectList={list => setCurrentList(list)}
                />
            )}
        </SafeAreaView>
    );
};

export default App;
