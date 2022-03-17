import { comment } from "./Comment";
import { user } from "./User";

export type post = {
    id: string;
    author: user;
    title: string;
    content: string;
    likes: number;
    created: number;
    users: Array<user>;
    size: string;
    comments?: Array<comment>;
}
