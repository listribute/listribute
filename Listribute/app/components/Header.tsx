import React from "react";
import { Header, HeaderProps } from "@rneui/base";
import { Platform, GestureResponderEvent } from "react-native";
import { listributeRed } from "./colors";

interface Props extends HeaderProps {
    onBackButton?: (event: GestureResponderEvent) => void;
}

const ListributeHeader: React.FC<Props> = props => {
    // It's not allowed to extend the props object directly
    const extensionProps: HeaderProps = {};

    if (props.onBackButton && Platform.OS === "ios") {
        extensionProps.leftComponent = {
            icon: "arrow-back",
            color: "white",
            onPress: props.onBackButton,
        };
    }

    return (
        <Header
            {...props}
            {...extensionProps}
            statusBarProps={{
                translucent: true,
            }}
            containerStyle={Platform.select({
                android:
                    Platform.Version <= 20 ? { paddingTop: 0, height: 56 } : {},
                default: {},
            })}
            backgroundColor={listributeRed}
        />
    );
};

export default ListributeHeader;
