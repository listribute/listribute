import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { Alert } from "react-native";
import { useActions, useAppState, useEffects } from "../overmind";
import { confirmFactoryReset } from "../alerts";

export const client = axios.create({
    // TODO: Extract baseURL to a config file
    baseURL: "https://vtek.no/listribute/api/",
    withCredentials: true, // for session cookie
});

export const endpoints = {
    auth: "auth",
    user: "user",
    list: "list",
    item: "item",
    subscription: "subscription",
};

const AxiosSetup: React.FC<React.PropsWithChildren<any>> = ({ children }) => {
    useAppState();
    const effects = useEffects();
    const actions = useActions();

    useEffect(() => {
        const onFulfilled = (response: AxiosResponse) => response;

        const onRejected = async (error: AxiosError) => {
            if (
                error?.response?.status === 401 &&
                error?.config?.url?.indexOf("auth") === -1
            ) {
                console.log("Session cookie expired, re-authenticating...");
                const credentials = await effects.storage.getUser();

                if (credentials == null) {
                    // This should be an impossible scenario
                    console.error("No credentials in store");
                    Alert.alert(
                        "Sorry 😢",
                        "Something has gone terribly wrong, your user is lost.\n\n" +
                            "If it was registered with an email address you can recover it after restarting the app.\n\n" +
                            "Sorry for the inconvenience.",
                        [
                            {
                                text: "Close",
                                onPress: () => {
                                    actions.factoryReset();
                                },
                            },
                        ],
                    );
                    return Promise.reject(error);
                }

                try {
                    await effects.api.login(credentials);
                } catch (err) {
                    // This is bad.
                    console.error("Tried to re-authenticate, but failed.", err);

                    // Ask the user if we should do a factory reset
                    Alert.alert(
                        "Sorry 😢",
                        "Something went wrong when trying to talk with the server.\n\n" +
                            "Please consider a factory reset if this issue persist.",
                        [
                            {
                                text: "OK",
                            },
                            {
                                text: "Factory reset",
                                onPress: async () => {
                                    const confirmed =
                                        await confirmFactoryReset();

                                    if (confirmed) {
                                        actions.factoryReset();
                                    }
                                },
                                style: "destructive",
                            },
                        ],
                    );

                    return Promise.reject(err);
                }

                console.log(
                    "Successfully re-authenticated, repeating request.",
                );
                return client.request(error.config);
            }

            // TODO: Implement some global generic error handler
            // to present some information to the user
            return Promise.reject(error);
        };

        const interceptor = client.interceptors.response.use(
            onFulfilled,
            onRejected,
        );

        return () => client.interceptors.response.eject(interceptor);
    });

    return children;
};

export default AxiosSetup;
