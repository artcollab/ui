import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import Register from "./Register";

export { }

it("email validation detects incorrect email", () => {
    render(<Register />);

    const inputField = screen.queryByPlaceholderText(/Email Address/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "not an email")
    expect(screen.getByText(/Invalid email/i)).toBeTruthy();
});

it("email validation allows correct email", () => {
    render(<Register />);

    const inputField = screen.queryByPlaceholderText(/Email Address/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "view@email.com")
    expect(screen.queryByText(/Invalid email/i)).toBeFalsy();
});

it("name validation detects invalid name", () => {
    render(<Register />);

    const inputField = screen.queryByPlaceholderText(/First Name/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "£45 !32")
    expect(screen.getByText(/Invalid Name/i)).toBeTruthy();
});

it("name validation allows correct name", () => {
    render(<Register />);

    const inputField = screen.queryByPlaceholderText(/First Name/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "Dave")
    expect(screen.queryByText(/Invalid Name/i)).toBeFalsy();
});

it("username validation detects valid username", () => {
    render(<Register />);

    const inputField = screen.queryByPlaceholderText(/User Name/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "ExampleUsername-4576");
    expect(screen.queryByText(/Invalid Username/i)).toBeFalsy();
});

it("username validation detects invalid username", () => {
    render(<Register />);

    const inputField = screen.queryByPlaceholderText(/User Name/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "ExampleUsername!#?");
    expect(screen.getByText(/Invalid Username/i)).toBeTruthy();
});