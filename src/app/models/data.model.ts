export interface Board {
    id: number, title: string
}

export interface List {
    id: number;
    title: string;
    boardId: number;
    position: number;
}

export interface ListCard {
    id: number;
    title: string;
    list_id: number;
    board_id: number;
    position: number;
}