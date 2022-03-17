import { user } from "./User";

export type chatBoxComment = {
    user: user,
    text: string
}

export type comment = {
    id?: string;
    author: user;
    content: string;
    likes?: number;
    created?: number;
    isOnOwnPost?: boolean;
    post_id?: string;
}
