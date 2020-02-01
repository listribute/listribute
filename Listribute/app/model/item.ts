export interface Item {
    id: number;
    name: string;
    description?: string;
    imgUrl?: string;
    listId: number;
    order: number;
    created: string;
    createdBy: number;
    checkedBy: string[];
}
