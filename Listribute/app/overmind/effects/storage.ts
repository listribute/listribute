import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../../model/user";

const USER_KEY = "LISTRIBUTE_USER";

export const getUser = async (): Promise<User | undefined> => {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    if (userJson) {
        return JSON.parse(userJson);
    }
    return undefined;
};

export const setUser = async (user: User): Promise<void> => {
    const userJson = JSON.stringify(user);
    return AsyncStorage.setItem(USER_KEY, userJson);
};

export const clearUser = async (): Promise<void> => {
    return AsyncStorage.removeItem(USER_KEY);
};
