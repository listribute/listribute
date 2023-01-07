import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Input } from "@rneui/base";
import React, { Fragment, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useActions, useAppState, useEffects } from "../../overmind";
import { RootStackParamList } from "../RootNavigation";

type Props = NativeStackScreenProps<RootStackParamList, "RecoverUser">;

const RecoverUser: React.FC<Props> = ({ navigation }) => {
    useAppState();
    const actions = useActions();
    const effects = useEffects();

    const [step, setStep] = useState(1);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string>();
    const [recoverError, setRecoverError] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const switchUser = async () => {
        if (!password) return;

        setIsLoading(true);
        const cred = { username, password };
        try {
            const recoveredUser = await effects.api.login(cred);
            actions.switchUser(recoveredUser);
            setStep(3);
        } catch (error: any) {
            switch (error?.response?.status) {
                case 401:
                    setLoginError("Wrong password");
                    break;
                default:
                    setLoginError(
                        `Server error(${error?.response?.status}). Try again later.`,
                    );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const recoverPassword = async () => {
        if (!username) return;

        setIsLoading(true);
        try {
            await effects.api.sendPassword(username);
            setStep(2);
        } catch (error: any) {
            switch (error?.response?.status) {
                case 400:
                    setRecoverError("Unknown username");
                    break;
                case 404:
                    setRecoverError("User has not configured email");
                    break;
                default:
                    setRecoverError(
                        `Server error(${error?.response?.status}). Try again later.`,
                    );
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {step === 1 ? (
                <Fragment>
                    <Input
                        label="Old username or email"
                        placeholder="username/email"
                        leftIcon={{ name: "person" }}
                        onChangeText={setUsername}
                        value={username}
                    />
                    <Text style={{ padding: 10 }}>
                        An email will be sent to the configured email address of
                        the username entered above.
                    </Text>
                    <Button
                        title="Recover user"
                        onPress={recoverPassword}
                        disabled={isLoading || username === ""}
                    />
                    {recoverError && (
                        <Text style={styles.errorText}>{recoverError}</Text>
                    )}
                </Fragment>
            ) : step === 2 ? (
                <Fragment>
                    <Input
                        label="Password from email"
                        placeholder="password"
                        leftIcon={{ name: "lock" }}
                        onChangeText={setPassword}
                        value={password}
                        secureTextEntry
                    />
                    <Text style={styles.text}>
                        An email with your password has been sent to you.
                    </Text>
                    <Button
                        title="Login"
                        onPress={switchUser}
                        disabled={isLoading}
                    />
                    <Text style={styles.errorText}>{loginError}</Text>
                </Fragment>
            ) : step === 3 ? (
                <Fragment>
                    <Text style={styles.text}>
                        You have successfully recovered your user!
                    </Text>
                    <Button
                        type="clear"
                        title="Go back"
                        onPress={() => navigation.goBack()}
                    />
                </Fragment>
            ) : (
                <Text style={styles.text}>Something went wrong...</Text>
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
    errorText: {
        color: "red",
        padding: 10,
        textAlign: "center",
    },
    text: {
        padding: 10,
        textAlign: "center",
    },
});

export default RecoverUser;
