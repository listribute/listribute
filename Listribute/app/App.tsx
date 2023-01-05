import { createOvermind } from "overmind";
import { Provider } from "overmind-react";
import React from "react";
import { StatusBar } from "react-native";
import RootNavigation from "./components/RootNavigation";
import { config } from "./overmind";

const App: React.FC = () => {
    const overmind = createOvermind(
        config,
        /*{ devtools: "10.17.7.153:3031" },*/
    );

    return (
        <Provider value={overmind}>
            <StatusBar barStyle="light-content" />
            <RootNavigation />
        </Provider>
    );
};

export default App;
