import { useEffect } from "react";
import { BackHandler } from "react-native";

// Handle back button on Android
const useBackButton = (onBackButton: () => void) => {
    useEffect(() => {
        const listener = BackHandler.addEventListener(
            "hardwareBackPress",
            () => {
                onBackButton();
                return true;
            },
        );
        return () => {
            listener.remove();
        };
    }, [onBackButton]);
};

export default useBackButton;
