import "react-native";
import React from "react";
import App from "../App";

// Note: test renderer must be required after react-native.
import renderer, { act, ReactTestRenderer } from "react-test-renderer";
import * as storage from "../app/storage";
import * as api from "../app/api";
import HomePage from "../app/components/HomePage";
import { User } from "../app/model/user";
import { List } from "../app/model/list";
import ListPage from "../app/components/ListPage";

jest.mock("../app/storage", () => ({
    getUser: async () => undefined,
    setUser: async (user: User) => undefined,
}));

jest.mock("../app/api", () => ({
    initialize: () => undefined,
    createNewUser: async () => undefined,
    login: async () => undefined,
}));

const dummyUser: User = {
    id: 1,
    username: "listribute_1",
    password: "random",
    pushNotifications: true,
};

it("renders correctly", () => {
    renderer.create(<App />);
});

it("creates new user if none exists", async () => {
    const getUserMock = jest
        .spyOn(storage, "getUser")
        .mockResolvedValueOnce(undefined);
    const setUserMock = jest.spyOn(storage, "setUser");

    const createNewUserMock = jest
        .spyOn(api, "createNewUser")
        .mockResolvedValueOnce(dummyUser);
    const initializeMock = jest.spyOn(api, "initialize");
    const loginMock = jest.spyOn(api, "login").mockResolvedValueOnce(dummyUser);
    let component: ReactTestRenderer;
    await act(async () => {
        component = renderer.create(<App />);
    });

    expect(getUserMock).toBeCalled();
    expect(createNewUserMock).toBeCalled();
    expect(setUserMock).toBeCalledWith(dummyUser);
    expect(initializeMock).toBeCalledWith(dummyUser);
    expect(loginMock).toBeCalledWith();
    expect(component!.root.findByType(HomePage).props.user).toBe(dummyUser);
});

it("navigates to list page if list is selected", async () => {
    jest.spyOn(api, "login").mockResolvedValueOnce(dummyUser);
    let component: ReactTestRenderer;
    await act(async () => {
        component = renderer.create(<App />);
    });
    const dummyList: List = {
        name: "list",
        wishList: false,
    };

    act(() =>
        component!.root.findByType(HomePage).props.onSelectList(dummyList),
    );

    expect(component!.root.findByType(ListPage).props.list).toBe(dummyList);
});
