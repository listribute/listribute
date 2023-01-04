import { derived } from "overmind";
import { List } from "../model/list";
import { User } from "../model/user";

type State = {
    title: string;
    currentUser: User;
    listById: Record<number, List>;
    lists: List[];
    initialized: boolean;
};

export const state: State = {
    title: "Listribute",
    currentUser: null!,
    listById: {},
    lists: derived(({ listById }: State) => Object.values(listById)),
    initialized: false,
};
