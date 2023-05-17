import { Button } from "@rneui/base";
import React from "react";
import { Alert } from "react-native";
import { useAppState } from "../../overmind/index";

interface Props {
    isWishList: boolean;
    onSetWishList: () => void;
}

const WishListButton: React.FC<Props> = ({ isWishList, onSetWishList }) => {
    useAppState();

    const setWishList = () => {
        if (!isWishList) {
            Alert.alert(
                "Sure?",
                "Once set to wish list, it can't be changed back. Are you sure?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Sure",
                        onPress: () => onSetWishList(),
                    },
                ],
            );
        }
    };

    return (
        <Button
            title={isWishList ? "This is a wish list" : "Convert to wish list"}
            disabled={isWishList}
            onPress={setWishList}
            type="clear"
        />
    );
};

export default WishListButton;
