import { render, screen } from "@testing-library/react";
import Post from "./Post";

it("appears on the screen", () => {
    render(<Post />);

    /* checks if the square container renders on screen */
    expect(screen.getByTestId("container-test")).toBeInTheDocument;

    /* checks if the post header renders on screen */
    expect(screen.getByTestId("post-header-test")).toBeInTheDocument;

    /* checks if the author name 'dogs72' is included within the page */
    const authorName = screen.getByText(/dogs72/i);
    expect(authorName).toBeInTheDocument;

});
