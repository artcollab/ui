import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";

export {}

const mockedUsedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
   ...jest.requireActual('react-router-dom') as any,
  useNavigate: () => mockedUsedNavigate,
}));

it("email validation detects incorrect email", () => {
    render(<Login />);

    const inputField = screen.queryByPlaceholderText(/Email Address/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "not an email")
    expect(screen.getByText(/Invalid email/i)).toBeTruthy();
});

it("email validation allows correct email", () => {
    render(<Login />);

    const inputField = screen.queryByPlaceholderText(/Email Address/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "example@email.com")
    expect(screen.queryByText(/Invalid email/i)).toBeFalsy();
});