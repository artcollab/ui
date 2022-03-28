 export type user = {
    id: string;
    admin?: boolean;
    username: string;
    email: string;
    name: string;
    surname: string;
    bio?: string;
    password?: string;
    following?: Array<string>;
    friends?: Array<string>;
    profileID: string;
}
