import { comment } from "./Comment";
import { user } from "./User";

export type post = {
    user: user,
    image: any,
    caption: Text,
    likes: Array<user>,
    comments: Array<comment>
}