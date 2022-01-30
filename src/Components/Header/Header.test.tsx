import { render, screen } from "@testing-library/react";
import Header from "./Header";

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

it("appears on the screen", () => {
    render(<Header />);
    expect(screen.getByTestId("header-test")).toBeTruthy();
    expect(screen.getByPlaceholderText("Search…")).toBeTruthy();
});