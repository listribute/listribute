import axios from "axios";
import { Item } from "../model/item";
import { List } from "../model/list";
import { User } from "../model/user";

const client = axios.create({
    // TODO: Extract baseURL to a config file
    baseURL: "https://vtek.no/listribute/api/",
    withCredentials: true, // for session cookie
});

const endpoints = {
    auth: "auth",
    user: "user",
    list: "list",
    item: "item",
    subscription: "subscription",
};

// START /auth
export const login = (user: {
    username: string;
    password: string;
}): Promise<User> => {
    return client
        .post<User>(endpoints.auth, user)
        .then(response => response.data);
};

export const logout = (): Promise<void> => {
    return client.delete(endpoints.auth);
};
// END /auth

// START /user
export const createNewUser = (): Promise<User> => {
    return client.post<User>(endpoints.user).then(response => response.data);
};

export const updateUser = (user: User): Promise<void> => {
    return Promise.reject("Not implemented");

    // return $http.put(settings.baseUrl + '/user', user);
};

export const getUserInfo = (): Promise<User> => {
    return client.get<User>(endpoints.user).then(response => response.data);
};

export const testUsername = (username: string): Promise<void> => {
    return Promise.reject("Not implemented");

    // return $http.get(settings.baseUrl + '/user/test/' + username);
};

export const registerGCMToken = (token: string): Promise<void> => {
    return Promise.reject("Not implemented");

    // return $http.post(settings.baseUrl + '/user/token/android', {token: token});
};

export const registerAPNToken = (token: string): Promise<void> => {
    return Promise.reject("Not implemented");

    // return $http.post(settings.baseUrl + '/user/token/ios', {token: token});
};

export const sendPassword = (username: string): Promise<void> => {
    return Promise.reject("Not implemented");

    // return $http.get(settings.baseUrl + '/user/' + username + '/sendpassword');
};
// END /user

// START /list
export const createNewList = (wishList: boolean): Promise<List> => {
    return client
        .post<List>(endpoints.list, { wishList })
        .then(response => response.data);
};

export const updateList = (list: List): Promise<void> => {
    return Promise.reject("Not implemented");

    // return $http.put(settings.baseUrl + '/list', list);
};

export const getList = (listId: number): Promise<List> => {
    return client
        .get<List>(`${endpoints.list}/${listId}`)
        .then(response => response.data);
};

export const getAllLists = (): Promise<List[]> => {
    return client.get<List[]>(endpoints.list).then(response => response.data);
};

export const getListItems = (listId: number): Promise<Item[]> => {
    return client
        .get<Item[]>(`${endpoints.list}/${listId}/items`)
        .then(response => response.data);
};
// END /list

// START /item
export const createNewItem = (item: {
    listId: number;
    name: string;
    order: number;
}): Promise<Item> => {
    return client
        .post<Item>(endpoints.item, item)
        .then(response => response.data);
};

export const updateItem = (item: Item): Promise<void> => {
    return Promise.reject("Not implemented");

    // return $http.put(settings.baseUrl + '/item', item);
};

export const checkItem = (itemId: number): Promise<void> => {
    return client.post(`${endpoints.item}/${itemId}/check`);
};

export const uncheckItem = (itemId: number): Promise<void> => {
    return client.delete(`${endpoints.item}/${itemId}/check`);
};

export const removeItem = (itemId: number): Promise<void> => {
    return client.delete(`${endpoints.item}/${itemId}`);
};
// END /item

// START /subscription
export const addUserToList = (
    listId: number,
    username: string,
): Promise<void> => {
    return Promise.reject("Not implemented");

    // return $http.post(settings.baseUrl + '/subscription',
    //   {listId:listId,username:username});
};

export const removeListForUser = (listId: number): Promise<void> => {
    return client.delete(`${endpoints.subscription}/${listId}`);
};
// END /subscription
