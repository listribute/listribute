import { Alert } from "react-native";

export const confirmFactoryReset = (): Promise<boolean> => {
    let resolve: (b: boolean) => void | undefined;
    const promise = new Promise<boolean>(res => {
        resolve = res;
    });

    Alert.alert(
        "⚠️ Warning ⚠️",
        "Are you sure you want to do a factory reset?\n\n" +
            "This will start over with a fresh user and you will loose all your current lists.\n\n" +
            "Make sure you have configured an email address if you want to be able to recover this user.",
        [
            {
                text: "Sure",
                onPress: () => resolve(true),
                style: "destructive",
            },
            { text: "Cancel", onPress: () => resolve(false) },
        ],
    );

    return promise;
};
