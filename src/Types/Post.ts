import { comment } from "./Comment";
import { user } from "./User";

export type post = {
    id: number,
    user: user,
    image: any,
    caption: string, /* Text */
    likes: Array<user>,
    comments: Array<comment>,
    size: string
}
