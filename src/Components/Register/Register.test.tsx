import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import Register from "./Register";

export {}

it("email validation detects incorrect email", () => {
    const example = render(<Register />);

    const inputField = example.queryByPlaceholderText(/Email Address/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "not an email")
    expect(example.queryByText(/Invalid email/i)).toBeTruthy();
});

it("email validation allows correct email", () => {
    const example = render(<Register />);

    const inputField = example.queryByPlaceholderText(/Email Address/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "example@email.com")
    expect(example.queryByText(/Invalid email/i)).toBeFalsy();
});

it("name validation detects invalid name", () => {
    const example = render(<Register />);

    const inputField = example.queryByPlaceholderText(/First Name/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "£45 !32")
    expect(example.queryByText(/Invalid Name/i)).toBeTruthy();
});

it("name validation allows correct name", () => {
    const example = render(<Register />);

    const inputField = example.queryByPlaceholderText(/First Name/i);
    expect(inputField).toBeTruthy();

    userEvent.type(inputField!, "Dave")
    expect(example.queryByText(/Invalid Name/i)).toBeFalsy();
});