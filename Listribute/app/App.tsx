import { createOvermind } from "overmind";
import { Provider as OvermindProvider } from "overmind-react";
import React from "react";
import { StatusBar } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import RootNavigation from "./components/RootNavigation";
import { config } from "./overmind";

const App: React.FC = () => {
    const overmind = createOvermind(
        config,
        /*{ devtools: "10.17.7.153:3031" },*/
    );

    return (
        <OvermindProvider value={overmind}>
            <PaperProvider>
                <StatusBar barStyle="light-content" />
                <RootNavigation />
            </PaperProvider>
        </OvermindProvider>
    );
};

export default App;
