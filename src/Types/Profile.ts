import { post } from "./Post";
import { user } from "./User";

export type profile = {
    user: user,
    friends: Array<user>,
    posts: Array<post>
}