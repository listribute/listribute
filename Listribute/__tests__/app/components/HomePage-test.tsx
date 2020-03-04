import React from "react";
import "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
// Note: test renderer must be required after react-native.
import renderer, { act, ReactTestRenderer } from "react-test-renderer";
import * as api from "../../../app/api";
import HomePage from "../../../app/components/HomePage";
import { List } from "../../../app/model/list";
import { User } from "../../../app/model/user";

jest.mock("../../../app/api", () => ({
    getAllLists: async () => undefined,
    removeListForUser: async () => undefined,
}));

const dummyUser: User = {
    id: 1,
    username: "listribute_1",
    password: "random",
    pushNotifications: true,
};

const dummyList: List = {
    name: "random",
    wishList: false,
};

it("renders component correctly", () => {
    renderer.create(<HomePage user={dummyUser} onSelectList={jest.fn()} />);
});

it("fetches all lists on mount", () => {
    const getAllListsSpy = jest.spyOn(api, "getAllLists");

    act(() => {
        renderer.create(<HomePage user={dummyUser} onSelectList={jest.fn()} />);
    });

    expect(getAllListsSpy).toBeCalled();

    getAllListsSpy.mockRestore();
});

it("refreshes lists on demand", async () => {
    const getAllListsMock = jest
        .spyOn(api, "getAllLists")
        .mockResolvedValueOnce([dummyList]);

    let component: ReactTestRenderer;
    await act(async () => {
        component = renderer.create(
            <HomePage user={dummyUser} onSelectList={jest.fn()} />,
        );
    });

    // Simulate refresh
    await act(async () =>
        component!.root.findByType(SwipeListView).props.onRefresh(),
    );

    expect(getAllListsMock).toBeCalledTimes(2); // Once initially

    getAllListsMock.mockRestore();
});
