import {render, fireEvent} from "@testing-library/react";
import Feed from "./Feed";
import React from "react";
import '@testing-library/jest-dom';

export {}

global.scroll = jest.fn()
global.scrollTo = jest.fn()

/* tests the Feed's scroll button */
it("scroll button display test", () => {

    /* renders the Feed component for testing */
    const feedComponent = render(<Feed/>);

    /* fireEvent makes the window scroll down to the Y position of 350,
    this the threshold where the scroll button will show  */
    fireEvent.scroll(window, { target: { scrollY: 350 } })

    /* gets the scroll button element from the feed component via test id */
    const scrollButton = feedComponent.getByTestId("scroll-button-test");

    /* the scroll button should be in the document after the right amount of scrolling has been done */
    expect(scrollButton).toBeInTheDocument();

})

/* tests the Feed's creation button */
it("create button display test", () => {

    /* renders the Feed component for testing */
    const feedComponent = render(<Feed/>);

    /* gets the create button element from the feed component via test id */
    const createButton = feedComponent.getByTestId("create-button-test");

    /* the create button should be in the document straight away */
    expect(createButton).toBeInTheDocument();

})

/* tests the Feed's scroll button functionality */
it("scroll button function test", () => {

    /* renders the Feed component for testing */
    const feedComponent = render(<Feed/>);

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
    expect(window.screenY === 0);

})
