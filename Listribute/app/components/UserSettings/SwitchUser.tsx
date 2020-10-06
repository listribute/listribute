import React, { useState } from "react";
import { Text, View } from "react-native";
import { Button, Input } from "react-native-elements";
import EmailInput from "../EmailInput";
import * as api from "../../api";
import { AxiosError } from "axios";
import { User } from "../../model/user";

interface Props {
    username: string;
    onChange: (user: User) => void;
}

const SwitchUser: React.FC<Props> = ({ username: usernameProp, onChange }) => {
    const [username, setUsername] = useState(usernameProp);
    const [password, setPassword] = useState<string>("");
    const [showRecover, setShowRecover] = useState(false);
    const [switchError, setSwitchError] = useState<string>();
    const [recoverStatus, setRecoverStatus] = useState({
        success: true,
        text: "",
    });

    const switchUser = async () => {
        const cred = { username, password };
        try {
            const user = await api.login(cred);
            onChange(user);
        } catch (error) {
            switch (error?.response?.status) {
                case 401:
                    setSwitchError("Wrong username/password");
                    break;
                default:
                    setSwitchError(
                        `Server error(${error?.response?.status}). Try again later.`,
                    );
            }
        }
    };

    const recoverPassword = async () => {
        if (!showRecover) {
            setShowRecover(true);
            return;
        }

        try {
            await api.sendPassword(username);
            setRecoverStatus({
                success: true,
                text: "Email sent successfully",
            });
        } catch (error) {
            switch (error?.response?.status) {
                case 400:
                    setRecoverStatus({
                        success: false,
                        text: "Unknown username",
                    });
                    break;
                case 404:
                    setRecoverStatus({
                        success: false,
                        text: "User has not configured email",
                    });
                    break;
                default:
                    setRecoverStatus({
                        success: false,
                        text: `Server error(${error?.response?.status}). Try again later.`,
                    });
            }
        }
    };

    return (
        <View>
            <Input
                label="Username"
                placeholder="username"
                leftIcon={{ name: "edit" }}
                onChangeText={setUsername}
                value={username}
            />
            <Input
                label="Password"
                placeholder="password"
                leftIcon={{ name: "lock" }}
                onChangeText={setPassword}
                value={password}
            />
            <Button title="Switch user" onPress={switchUser} />
            <Text style={{ color: "red" }}>{switchError}</Text>
            {showRecover && (
                <Text style={{ padding: 10 }}>
                    An email will be sent to the configured email address of the
                    username entered above.
                </Text>
            )}
            <Button
                title="Recover password"
                type={showRecover ? "solid" : "clear"}
                onPress={recoverPassword}
            />
            <Text style={{ color: recoverStatus.success ? "green" : "red" }}>
                {recoverStatus.text}
            </Text>
        </View>
    );
};

export default SwitchUser;
