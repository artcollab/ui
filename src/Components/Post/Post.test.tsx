import { render, screen } from "@testing-library/react";
import Post from "./Post";
import {post} from "../../Types/Post";

const tempPost : post = {
    id: 0,
    user: {
        id: "",
        username: "",
        email: "",
        name: "",
        surname: "",
        password: "",
        following: undefined
    },
    image: " ",
    caption: " ",
    likes: [],
    comments: [],
    size: " "
}

it("appears on the screen", () => {
    render(<Post Post={tempPost}/>);

    /* checks if the square container renders on screen */
    expect(screen.getByTestId("container-test")).toBeTruthy();

    /* checks if the post header renders on screen */
    expect(screen.getByTestId("post-header-test")).toBeTruthy();
});
