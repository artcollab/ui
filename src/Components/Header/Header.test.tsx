import { render, screen } from "@testing-library/react";
import Header from "./Header";

it("appears on the screen", () => {
    render(<Header />);
    expect(screen.getByTestId("header-test")).toBeInTheDocument;
    expect(screen.getByPlaceholderText("Search…")).toBeInTheDocument;
});