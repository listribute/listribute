import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Icon, ListItem } from "@rneui/base";

interface Props {
    currentUser: string;
    users?: string[];
}

const UserList: React.FC<Props> = ({ currentUser, users: usersProp }) => {
    const [users, setUsers] = useState(usersProp);

    useEffect(() => setUsers(usersProp), [usersProp]);

    return (
        <View style={{ height: "100%" }}>
            {users?.map(user => (
                <ListItem key={user} bottomDivider>
                    <Icon name="person" />
                    <ListItem.Content>
                        <ListItem.Title>
                            {user === currentUser ? `${user} (YOU)` : user}
                        </ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            ))}

            {!users && <Text>Loading...</Text>}
        </View>
    );
};

export default UserList;
