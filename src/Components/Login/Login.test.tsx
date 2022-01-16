import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";

export {}

it("email validation detects incorrect email", () => {
    const example = render(<Login />);

    const inputField = example.queryByPlaceholderText(/Email Address/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "not an email")
    expect(example.queryByText(/Invalid email/i)).toBeTruthy();
});

it("email validation allows correct email", () => {
    const example = render(<Login />);

    const inputField = example.queryByPlaceholderText(/Email Address/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "example@email.com")
    expect(example.queryByText(/Invalid email/i)).toBeFalsy();
});