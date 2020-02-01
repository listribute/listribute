import React, { useEffect, useState } from "react";
import { FlatList, Platform, View } from "react-native";
import {
    Button,
    Card,
    Header,
    Icon,
    ListItem,
    Text,
} from "react-native-elements";
import { getAllLists } from "../../api";
import { List } from "../../model/list";
import { User } from "../../model/user";

interface Props {
    user: User;
    onSelectList: (list: List) => void;
}

const HomePage: React.FC<Props> = ({ user, onSelectList }) => {
    const [lists, setLists] = useState<List[]>();

    useEffect(() => {
        (async () => {
            const lists = await getAllLists();
            setLists(lists);
        })();
    }, []);

    return (
        <View>
            <Header
                statusBarProps={{
                    translucent: true,
                }}
                containerStyle={Platform.select({
                    android:
                        Platform.Version <= 20
                            ? { paddingTop: 0, height: 56 }
                            : {},
                })}
                backgroundColor={"#d81919"}
                centerComponent={{
                    text: `Hi, ${user.username}`,
                    style: { color: "white" },
                }}
                rightComponent={{
                    icon: "add",
                    color: "white",
                }}
            />

            {lists && lists.length > 0 && (
                <FlatList
                    data={lists}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item: list }) => (
                        <ListItem
                            title={list.name}
                            leftIcon={{ name: "settings" }}
                            onPress={() => onSelectList(list)}
                            onLongPress={() =>
                                console.log(`DELETE LIST ${list.id}`)
                            }
                            bottomDivider
                            chevron
                        />
                    )}
                ></FlatList>
            )}

            {!lists && <Text>Loading...</Text>}

            {lists?.length === 0 && (
                <Card title="Welcome">
                    <Text style={{ marginBottom: 10 }}>
                        You have no lists yet. Time to add one!
                    </Text>
                    <Button
                        buttonStyle={{ backgroundColor: "#d81919" }}
                        icon={<Icon name="add" color="white" />}
                        title="Add new list"
                    />
                </Card>
            )}
        </View>
    );
};

export default HomePage;
