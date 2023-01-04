import { Icon, ListItem } from "@rneui/base";
import React from "react";
import { Text, View } from "react-native";
import { useAppState } from "../../overmind";

interface Props {
    users?: string[];
}

const UserList: React.FC<Props> = ({ users }) => {
    const state = useAppState();

    return (
        <View style={{ height: "100%" }}>
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

export default UserList;
