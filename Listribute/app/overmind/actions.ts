import { IAction } from "overmind";
import { Context } from ".";
import { List } from "../model/list";
import { User } from "../model/user";

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

    const user = await effects.api.login(credentials);
    state.currentUser = user;

    await actions.refreshLists();

    state.initialized = true;
};

export const switchUser: IAction<User, void> = (
    { state, effects }: Context,
    user,
) => {
    effects.storage.setUser(user);
    state.currentUser = user;
};

export const createList: IAction<boolean, Promise<List>> = async (
    { actions, effects }: Context,
    isWishList,
) => {
    const newList = await effects.api.createNewList(isWishList);
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
> = async ({ state, effects }: Context, { listId, newName }) => {
    const list = state.listById[listId];
    const updatedList = await effects.api.updateList({
        ...list,
        name: newName,
    });
    state.listById[listId] = updatedList;
};

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
