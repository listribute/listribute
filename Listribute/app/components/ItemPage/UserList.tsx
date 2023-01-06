import { Icon, ListItem } from "@rneui/base";
import React from "react";
import { FlatList } from "react-native";
import { useAppState } from "../../overmind";

interface Props {
    users: string[];
}

const UserList: React.FC<Props> = ({ users }) => {
    const state = useAppState();

    return (
        <FlatList
            data={users}
            keyExtractor={item => item}
            renderItem={({ item: user }) => (
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
            )}
        />
    );
};

export default UserList;
