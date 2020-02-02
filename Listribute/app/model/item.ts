export interface Item {
    id?: number;
    name: string;
    description?: string;
    imgUrl?: string;
    listId: number;
    order: number;
    checkedBy?: string[];
}
