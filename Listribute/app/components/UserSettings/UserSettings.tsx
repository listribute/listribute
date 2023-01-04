import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Header from "../Header";
import useBackButton from "../../hooks/useBackButton";
import { User } from "../../model/user";
import UsernameInput from "./UsernameInput";
import EmailInput from "./EmailInput";
import RecoverUser from "./RecoverUser";
import { Button } from "@rneui/base";
import * as api from "../../api";

interface Props {
    user: User;
    onBack: () => void;
    onSwitchUser: (user: User) => void;
}

const UserSettings: React.FC<Props> = ({
    user: userProp,
    onBack: onBackProp,
    onSwitchUser,
}) => {
    const onBack = () => {
        if (switchUser) {
            setSwitchUser(false);
        } else {
            onBackProp?.();
        }
    };
    useBackButton(onBack);

    const [user, setUser] = useState(userProp);
    useEffect(() => {
        setUser(userProp);
    }, [userProp]);

    const setUsername = async (newUsername: string) => {
        const updatedUser = {
            ...user,
            username: newUsername,
        };
        setUser(updatedUser);

        if (newUsername !== userProp.username && newUsername !== "") {
            try {
                await api.testUsername(newUsername);
                setIsUsernameConflicting(false);
            } catch (err) {
                setIsUsernameConflicting(true);
            }
        }
    };

    const setEmail = (newEmail: string) => {
        const updatedUser = {
            ...user,
            email: newEmail,
        };
        setUser(updatedUser);
    };

    const [isUsernameConflicting, setIsUsernameConflicting] = useState(false);
    const [saveStatus, setSaveStatus] = useState({ success: true, text: "" });

    const save = async () => {
        try {
            const updatedUser = await api.updateUser(user);
            onSwitchUser(updatedUser);
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
    };

    const [switchUser, setSwitchUser] = useState(false);

    return (
        <View style={styles.container}>
            <Header
                onBackButton={onBack}
                centerComponent={{
                    text: "User settings",
                    style: { color: "white", fontSize: 18 },
                }}
                rightComponent={{
                    icon: "save",
                    color: "white",
                    onPress: save,
                }}
            />
            <View style={styles.br} />
            {switchUser ? (
                <RecoverUser
                    onChange={recoveredUser => {
                        onSwitchUser(recoveredUser);
                        setSwitchUser(false);
                    }}
                />
            ) : (
                <View>
                    <UsernameInput
                        username={user.username}
                        onChange={setUsername}
                        conflicting={isUsernameConflicting}
                    />
                    <EmailInput email={user.email ?? ""} onChange={setEmail} />
                    <Text
                        style={{ color: saveStatus.success ? "green" : "red" }}>
                        {saveStatus.text}
                    </Text>
                    <Button
                        title="Recover old user"
                        type="clear"
                        onPress={() => setSwitchUser(true)}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
    br: {
        height: 25,
    },
});

export default UserSettings;
