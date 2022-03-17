import { screen, render, fireEvent } from "@testing-library/react";
import Comment from "./Comment";
import React from "react";

export{}

it("comment section tests", () => {

    /* initialises & renders the comment component */
    render(<Comment commentsList={[]} setFocused={(value: boolean) => (value)} post_id={""}/>);

    /* Test that the TextField contains the correct placeholder text */
    const textFieldPlaceholder = screen.queryByPlaceholderText(/...../i);
    expect(textFieldPlaceholder).toBeTruthy();

    /* 'alertPopup' spies on the window for an alert method being called */
    const alertPopup = jest.spyOn(window, 'alert').mockImplementation();

    /* gets the button for submitting comments  */
    const commentButton = screen.getByTestId("comment-button-test");

    /* uses fireEvent to simulate a click of the comment button */
    fireEvent.click(commentButton);

    /* due to there being no characters entered within the TextField then an alert is
    * thrown & alertPopup can be expected to be called, if true then the test passes */
    expect(alertPopup).toBeCalled();

});
