import React from "react";
import { CheckBox } from "@rneui/base";
import { Alert } from "react-native";

interface Props {
    isWishList: boolean;
    onChange: (isWishList: boolean) => void;
}

const WishListCheckBox: React.FC<Props> = ({ isWishList, onChange }) => {
    const toggleWishList = () => {
        if (isWishList) {
            onChange(false);
        } else {
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
                        onPress: () => onChange(true),
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
            onPress={() => !isWishList && toggleWishList()}
        />
    );
};

export default WishListCheckBox;
