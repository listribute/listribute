export class Item {
    readonly id: number;
    readonly name: string;
    readonly description?: string | null;
    readonly imgUrl?: string | null;
    readonly listId: number;
    readonly order: number;
    private _checkedBy: string[];
    get checkedBy() {
        return this._checkedBy.slice();
    }
    set checkedBy(value: string[]) {
        this._checkedBy = value.slice();
    }

    constructor(from: any) {
        // TODO: Input validation
        this.id = from.id;
        this.name = from.name;
        this.description = from.description;
        this.imgUrl = from.imgUrl;
        this.listId = from.listId;
        this.order = from.order;
        this._checkedBy = from.checkedBy?.slice() ?? [];
    }
}
