export type user = {
    id: string;
    username: string;
    email: string;
    name: string;
    surname: string;
    password: string;
    following?: Array<string>;
}
