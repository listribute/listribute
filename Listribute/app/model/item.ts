export interface Item {
    id: number;
    name: string;
    description?: string | null;
    imgUrl?: string | null;
    listId: number;
    order: number;
    checkedBy: string[];
}
