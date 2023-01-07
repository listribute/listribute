import { Observable } from "rxjs";
import { client, endpoints } from "../../components/AxiosSetup";
import { Item } from "../../model/item";
import { List } from "../../model/list";
import { User } from "../../model/user";

export type Credentials = {
    username: string;
    password: string;
};

// START /auth
export const login = async (credentials: Credentials): Promise<User> => {
    return client
        .post<User>(endpoints.auth, credentials)
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

export const updateUser = (user: User): Promise<User> => {
    return client
        .put<User>(endpoints.user, user)
        .then(response => response.data);
};

export const getUserInfo = (): Promise<User> => {
    return client.get<User>(endpoints.user).then(response => response.data);
};

export const testUsername = (username: string): Promise<void> => {
    return client.get(`${endpoints.user}/test/${username}`);
};

export const registerGCMToken = (_token: string): Promise<void> => {
    return Promise.reject("Not implemented");

    // return $http.post(settings.baseUrl + '/user/token/android', {token: token});
};

export const registerAPNToken = (_token: string): Promise<void> => {
    return Promise.reject("Not implemented");

    // return $http.post(settings.baseUrl + '/user/token/ios', {token: token});
};

export const sendPassword = (username: string): Promise<void> => {
    return client.get(`${endpoints.user}/${username}/sendpassword`);
};
// END /user

// START /list
export const createNewList = (wishList: boolean): Promise<List> => {
    return client
        .post<List>(endpoints.list, { wishList })
        .then(response => response.data);
};

export const updateList = (list: List): Promise<List> => {
    return client
        .put<List>(endpoints.list, list)
        .then(response => response.data);
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
    return client.put(`${endpoints.item}/${item.id}`, item);
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
    const subscription = { listId: listId, username: username };
    return client.post(endpoints.subscription, subscription);
};

export const removeListForUser = (listId: number): Promise<void> => {
    return client.delete(`${endpoints.subscription}/${listId}`);
};
// END /subscription

// START observables

// TODO: Create persistent websocket connection

export const listsObservable: Observable<List> = new Observable(_subscriber => {
    // TODO: Subscribe to new list updates over websocket connection
    // setTimeout(() => {
    //     subscriber.next({...});
    // }, 5000);

    return () => {
        // TODO: Dispose subscription
    };
});

export const itemsObservable = (_listId: number): Observable<Item[]> =>
    new Observable(_subscriber => {
        // TODO: Subscribe to items updates over websocket connection
        // setTimeout(() => {
        //     subscriber.next([]);
        // }, 5000);

        return () => {
            // TODO: Dispose subscription
        };
    });
// END observables
