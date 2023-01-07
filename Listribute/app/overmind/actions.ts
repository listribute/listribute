import { debounce, IAction, pipe } from "overmind";
import { Alert } from "react-native";
import { Context } from ".";
import { List } from "../model/list";
import { User } from "../model/user";
import { confirmFactoryReset } from "../alerts";

// Magic action that is identified by name and called by Overmind on startup
export const onInitializeOvermind = async ({
    state,
    actions,
    effects,
}: Context) => {
    // Look for user credentials in storage
    let credentials = await effects.storage.getUser();

    if (!credentials) {
        // Create a new user automatically
        credentials = await effects.api.createNewUser();
        // Store the new user's credentials
        effects.storage.setUser(credentials);
    }

    try {
        const user = await effects.api.login(credentials);
        state.currentUser = user;

        await actions.refreshLists();

        state.initialized = true;
    } catch (error) {
        // The credentials may somehow be corrupt, perhaps something happened
        // server side.
        // Let the user choose to do a "factory reset"
        Alert.alert(
            "Sorry 😢",
            "Something went wrong when trying to talk with the server.\n\n" +
                "Please close the app and try again later or do a factory reset to start over.",
            [
                {
                    text: "Close",
                    onPress: () => {
                        throw new Error("Close");
                    },
                },
                {
                    text: "Factory reset",
                    onPress: async () => {
                        const confirmed = await confirmFactoryReset();
                        if (confirmed) {
                            await actions.factoryReset();
                            // Call itself to start over with a new user
                            actions.onInitializeOvermind();
                        }
                    },
                    style: "destructive",
                },
            ],
        );
    }
};

export const factoryReset: IAction<void, Promise<void>> = async ({
    state,
    effects,
}: Context) => {
    await effects.storage.clearUser();
    state.initialized = false;
};

export const switchUser: IAction<User, Promise<void>> = async (
    { state, actions, effects }: Context,
    user,
) => {
    effects.storage.setUser(user);
    state.currentUser = user;
    await actions.refreshLists();
};

export const createList: IAction<boolean, Promise<List>> = async (
    { state, actions, effects }: Context,
    isWishList,
) => {
    const newList = await effects.api.createNewList(isWishList);
    // TODO: The initial subscribers should be populated by the API, but as
    //       that's not the case, we need this work around here.
    newList.subscribers.push(state.currentUser.username);
    actions.addList(newList);
    return newList;
};

export const addList: IAction<List, void> = ({ state }: Context, list) => {
    state.listById[list.id] = { ...list };
};

export const removeList: IAction<number, Promise<void>> = async (
    { state, effects }: Context,
    listId,
) => {
    await effects.api.removeListForUser(listId);
    delete state.listById[listId];
};

export const refreshLists: IAction<void, Promise<void>> = async ({
    state,
    effects,
}: Context) => {
    const lists = await effects.api.getAllLists();
    state.listById = lists.reduce(
        (acc, l) => (acc[l.id] = l) && acc,
        {} as any,
    );
};

export const updateListName: IAction<
    { listId: number; newName: string },
    Promise<void>
> = pipe(
    debounce(300),
    async ({ state, effects }: Context, { listId, newName }) => {
        const list = state.listById[listId];
        const updatedList = await effects.api.updateList({
            ...list,
            name: newName,
        });
        state.listById[listId] = updatedList;
    },
);

export const setAsWishList: IAction<number, Promise<void>> = async (
    { state, effects }: Context,
    listId,
) => {
    const list = state.listById[listId];
    const updatedList = await effects.api.updateList({
        ...list,
        wishList: true,
    });
    state.listById[listId] = updatedList;
};

export const addUserToList: IAction<
    { listId: number; username: string },
    Promise<void>
> = async ({ state, effects }: Context, { listId, username }) => {
    await effects.api.addUserToList(listId, username);
    const list = state.listById[listId];
    list.subscribers = [...list.subscribers, username];
};
