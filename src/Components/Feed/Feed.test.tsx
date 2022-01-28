import {render, waitFor, screen, fireEvent} from "@testing-library/react";
import Feed from "./Feed";
import React from "react";
import {post} from "../../Types/Post";

export {}

const tempPost : post = {
    id: 0,
    user: {
        name: " ",
        thumbnail: " ",
        color: " ",
    },
    image: " ",
    caption: " ",
    likes: [],
    comments: []
}

/* renders the Feed component for testing */
const feedComponent = render(<Feed posts={[tempPost]}/>);

/* tests the Feed's scroll button */
it("scroll button test", () => {

    /* fireEvent makes the window scroll down to the Y position of 350,
    this the threshold where the scroll button will show  */
    fireEvent.scroll(window, { target: { scrollY: 350 } })

    /* spys on the window method of 'scroll' */
    jest.spyOn(window, 'scroll')

    /* gets the scroll button element from the feed component via test id */
    const scrollButton = feedComponent.getByTestId("scroll-button-test");

    /* fireEvent will simulate a click on the scroll button */
    fireEvent.click(scrollButton);

    /* once the scroll button is clicked the user should be at the top of the page */
    expect(window.scrollY === 0).toBeTruthy();

})
