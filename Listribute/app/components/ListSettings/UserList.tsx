import { Icon, ListItem } from "@rneui/base";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAppState } from "../../overmind";

interface Props {
    users?: string[];
}

const UserList: React.FC<Props> = ({ users }) => {
    const state = useAppState();

    return (
        <View style={styles.container}>
            {users?.map(user => (
                <ListItem key={user} bottomDivider>
                    <Icon name="person" />
                    <ListItem.Content>
                        <ListItem.Title>
                            {user === state.currentUser.username
                                ? `${user} (YOU)`
                                : user}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            ))}

            {!users && <Text>Loading...</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: "100%",
    },
});

export default UserList;
