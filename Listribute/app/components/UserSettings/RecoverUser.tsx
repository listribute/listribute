import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Input } from "@rneui/base";
import * as api from "../../api";
import { User } from "../../model/user";

interface Props {
    onChange: (user: User) => void;
}

const RecoverUser: React.FC<Props> = ({ onChange }) => {
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState<string>();
    const [recoverError, setRecoverError] = useState<string>();
    const [user, setUser] = useState<User>();

    const switchUser = async () => {
        if (!password) return;
        const cred = { username, password };
        try {
            const recoveredUser = await api.login(cred);
            setUser(recoveredUser);
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
        }
    };

    const recoverPassword = async () => {
        if (!username) return;

        try {
            await api.sendPassword(username);
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
        }
    };

    return step === 1 ? (
        <View>
            <Input
                label="Old username or email"
                placeholder="username/email"
                leftIcon={{ name: "person" }}
                onChangeText={setUsername}
                value={username}
            />
            <Button
                title="Recover user"
                type={"clear"}
                onPress={recoverPassword}
            />
            {recoverError && (
                <Text style={styles.errorText}>{recoverError}</Text>
            )}
        </View>
    ) : step === 2 ? (
        <View>
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
            <Button title="Login" type="clear" onPress={switchUser} />
            <Text style={styles.errorText}>{loginError}</Text>
        </View>
    ) : step === 3 && user ? (
        <View>
            <Text style={styles.text}>
                You have successfully recovered your user.
            </Text>
            <Button
                type="clear"
                title="Go back"
                onPress={() => onChange(user)}
            />
        </View>
    ) : (
        <Text style={styles.text}>Something went wrong...</Text>
    );

    // eslint-disable-next-line no-lone-blocks, no-unreachable
    {
        /* {showRecover && (
                <Text style={{ padding: 10 }}>
                    An email will be sent to the configured email address of the
                    username entered above.
                </Text>
            )} */
    }
};

const styles = StyleSheet.create({
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
