import React, { useEffect, useState } from "react";
import { BackHandler, FlatList, Platform, Text, View } from "react-native";
import { Header, ListItem } from "react-native-elements";
import { getListItems } from "../../api";
import { Item } from "../../model/item";
import { List } from "../../model/list";

interface Props {
    username: string;
    list: List;
    onBack: () => void;
}

const ListPage: React.FC<Props> = ({ username, list, onBack }) => {
    // Handle back button on Android
    useEffect(() => {
        const listener = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                onBack();
                return true;
            },
        );
        return () => {
            listener.remove();
        };
    }, []);

    const [items, setItems] = useState<Item[]>();

    useEffect(() => {
        (async () => {
            const items = await getListItems(list.id);
            setItems(items);
        })();
    }, []);

    return (
        <View style={{ height: "100%" }}>
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
                    text: list.name,
                    style: { color: "white" },
                }}
                rightComponent={{
                    icon: "add",
                    color: "white",
                }}
            />

            {items && (
                <FlatList
                    data={items}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <ListItem
                            title={item.name}
                            leftIcon={{
                                name:
                                    item.checkedBy.indexOf(username) > -1
                                        ? "check-circle"
                                        : item.checkedBy.length
                                        ? "radio-button-checked"
                                        : "radio-button-unchecked",
                            }}
                            bottomDivider
                        />
                    )}
                ></FlatList>
            )}

            {!items && <Text>Loading...</Text>}
        </View>
    );
};

export default ListPage;
