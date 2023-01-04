import { CheckBox } from "@rneui/base";
import React from "react";
import { Alert } from "react-native";
import { useAppState } from "../../overmind";

interface Props {
    isWishList: boolean;
    onSetWishList: () => void;
}

const WishListCheckBox: React.FC<Props> = ({ isWishList, onSetWishList }) => {
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
        <CheckBox
            checked={isWishList}
            title={"Wish list"}
            iconRight
            right
            onPress={setWishList}
        />
    );
};

export default WishListCheckBox;
