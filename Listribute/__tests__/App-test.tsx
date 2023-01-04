// import React from "react";
// import "react-native";
// // Note: test renderer must be required after react-native.
// import renderer, { act, ReactTestRenderer } from "react-test-renderer";
// import App from "../app/App";
// import * as api from "../app/api";
// import HomePage from "../app/components/HomePage";
// import ListPage from "../app/components/ListPage";
// import { List } from "../app/model/list";
// import { User } from "../app/model/user";
// import * as storage from "../app/storage";

// jest.mock("../app/storage", () => ({
//     getUser: async () => undefined,
//     setUser: async (_user: User) => undefined,
// }));

// jest.mock("../app/api", () => ({
//     initialize: () => undefined,
//     createNewUser: async () => undefined,
//     login: async () => undefined,
//     getAllLists: async () => undefined,
// }));

// const dummyUser: User = {
//     id: 1,
//     username: "listribute_1",
//     password: "random",
//     pushNotifications: true,
// };

// it("renders correctly", () => {
//     renderer.create(<App />);
// });

// it("creates new user if none exists", async () => {
//     const getUserMock = jest
//         .spyOn(storage, "getUser")
//         .mockResolvedValueOnce(undefined);
//     const setUserSpy = jest.spyOn(storage, "setUser");
//     const createNewUserMock = jest
//         .spyOn(api, "createNewUser")
//         .mockResolvedValueOnce(dummyUser);
//     const loginMock = jest.spyOn(api, "login").mockResolvedValueOnce(dummyUser);

//     let component: ReactTestRenderer;
//     await act(async () => {
//         component = renderer.create(<App />);
//     });

//     expect(getUserMock).toBeCalled();
//     expect(createNewUserMock).toBeCalled();
//     expect(setUserSpy).toBeCalledWith(dummyUser);
//     expect(loginMock).toBeCalledWith(dummyUser);
//     expect(component!.root.findByType(HomePage).props.user).toBe(dummyUser);

//     getUserMock.mockRestore();
//     setUserSpy.mockRestore();
//     createNewUserMock.mockRestore();
//     loginMock.mockRestore();
// });

// it("navigates to list page if list is selected", async () => {
//     const loginSpy = jest.spyOn(api, "login").mockResolvedValueOnce(dummyUser);

//     let component: ReactTestRenderer;
//     await act(async () => {
//         component = renderer.create(<App />);
//     });

//     const dummyList: List = {
//         name: "list",
//         wishList: false,
//     };

//     act(() =>
//         component!.root.findByType(HomePage).props.onSelectList(dummyList),
//     );

//     expect(component!.root.findByType(ListPage).props.list).toBe(dummyList);

//     loginSpy.mockRestore();
// });
