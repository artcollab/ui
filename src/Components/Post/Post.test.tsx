import { render, screen } from "@testing-library/react";
import Post from "./Post";
import {post} from "../../Types/Post";

const tempPost : post = {
    id: "",
    author: {
        id: "",
        username: "",
        email: "",
        name: "",
        surname: "",
        password: "",
        following: undefined
    },
    title: "",
    content: "",
    likes: 0,
    created: 0,
    users: []
}

global.URL.createObjectURL = jest.fn();

it("appears on the screen", () => {
    render(<Post Post={tempPost}/>);

    /* checks if the square container renders on screen */
    expect(screen.getByTestId("container-test")).toBeTruthy();

    /* checks if the post header renders on screen */
    expect(screen.getByTestId("post-header-test")).toBeTruthy();
});
