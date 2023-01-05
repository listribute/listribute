import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button } from "@rneui/base";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from ".././RootNavigation";
import { useActions, useAppState, useEffects } from "../../overmind";
import EmailInput from "./EmailInput";
import RecoverUser from "./RecoverUser";
import UsernameInput from "./UsernameInput";

type Props = NativeStackScreenProps<RootStackParamList, "UserSettings">;

const UserSettings: React.FC<Props> = ({ navigation }) => {
    const state = useAppState();
    const actions = useActions();
    const effects = useEffects();

    const [username, setUsername] = useState(state.currentUser.username);
    useEffect(() => {
        setUsername(state.currentUser.username);
    }, [state.currentUser.username]);

    const updateUsername = async (newUsername: string) => {
        setUsername(newUsername);

        if (newUsername !== state.currentUser.username && newUsername !== "") {
            try {
                await effects.api.testUsername(newUsername);
                setIsUsernameConflicting(false);
            } catch (err) {
                setIsUsernameConflicting(true);
            }
        }
    };

    const [email, setEmail] = useState(state.currentUser.email);
    useEffect(() => {
        setEmail(state.currentUser.email);
    }, [state.currentUser.email]);

    const updateEmail = (newEmail: string) => {
        setEmail(newEmail);
    };

    const [isUsernameConflicting, setIsUsernameConflicting] = useState(false);
    const [saveStatus, setSaveStatus] = useState({ success: true, text: "" });

    const save = useCallback(async () => {
        try {
            const updatedUser = await effects.api.updateUser({
                ...state.currentUser,
                username,
                email,
            });
            actions.switchUser(updatedUser);
            setSaveStatus({ success: true, text: "User settings saved" });
        } catch (error: any) {
            switch (error?.response?.status) {
                case 409:
                    setSaveStatus({
                        success: false,
                        text: "Username is taken",
                    });
                    break;
                default:
                    setSaveStatus({
                        success: false,
                        text: `Server error(${error?.response?.status}). Try again later.`,
                    });
            }
        }
    }, [state.currentUser, username, email, actions, effects.api]);

    const [recoverUser, setRecoverUser] = useState(false);

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    icon={{
                        name: "save",
                        color: "white",
                    }}
                    type="clear"
                    onPress={save}
                />
            ),
        });
    }, [navigation, save]);

    return (
        <View style={styles.container}>
            {recoverUser ? (
                <RecoverUser
                    onChange={recoveredUser => {
                        actions.switchUser(recoveredUser);
                        setRecoverUser(false);
                    }}
                />
            ) : (
                <View>
                    <UsernameInput
                        username={username}
                        onChange={updateUsername}
                        conflicting={isUsernameConflicting}
                    />
                    <EmailInput email={email ?? ""} onChange={updateEmail} />
                    <Text
                        style={
                            saveStatus.success ? styles.success : styles.failure
                        }>
                        {saveStatus.text}
                    </Text>
                    <Button
                        title="Recover old user"
                        type="clear"
                        onPress={() => setRecoverUser(true)}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: "100%",
        paddingTop: 20,
        padding: 5,
    },
    success: {
        color: "green",
    },
    failure: {
        color: "red",
    },
});

export default UserSettings;
