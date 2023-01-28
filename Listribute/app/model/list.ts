export class List {
    readonly id: number;
    readonly name: string;
    readonly wishList: boolean;
    readonly createdBy: number;
    private _subscribers: string[];
    get subscribers() {
        return this._subscribers.slice();
    }

    constructor(from: any) {
        // TODO: Input validation
        this.id = from.id;
        this.name = from.name;
        this.wishList = from.wishList;
        this.createdBy = from.createdBy;
        this._subscribers = from.subscribers?.slice() ?? [];
    }

    addSubscriber(username: string) {
        this._subscribers = [...this.subscribers, username];
    }

    isOwnWishList(userId: number) {
        return !!this?.wishList && this.createdBy === userId;
    }

    isOthersWishList(userId: number) {
        return !!this?.wishList && this.createdBy !== userId;
    }
}
