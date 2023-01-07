import { createOvermind } from "overmind";
import { Provider as OvermindProvider } from "overmind-react";
import React from "react";
import { StatusBar } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import AxiosSetup from "./components/AxiosSetup";
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
                <AxiosSetup>
                    <StatusBar barStyle="light-content" />
                    <RootNavigation />
                </AxiosSetup>
            </PaperProvider>
        </OvermindProvider>
    );
};

export default App;
