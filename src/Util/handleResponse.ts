import { user } from "../Types/User";

export function handleResponse(response: string) {
    localStorage.clear();
    if (response) {
        let res = JSON.parse(response);
        setRefreshToken(res['tokens']['rt']);
        setAccessToken(res['tokens']['at']);
        setUserData(res['user']);
    }
}

export function getRefreshToken(): string {
    const res = localStorage.getItem('rt');

    return res ? res : "";
}

export function setRefreshToken(token: JSON) {
    localStorage.setItem('rt', JSON.stringify(token));
}

export function getAccessToken(): string {
    const res = localStorage.getItem('at');

    return res ? res : "";
}

export function setAccessToken(token: JSON) {
    localStorage.setItem('at', JSON.stringify(token));
}

export function setUserData(user: JSON) {
    localStorage.setItem('user', JSON.stringify(user));
}

export function getUserData(): JSON | null {
    const res = localStorage.getItem('user');

    return res ? JSON.parse(res) : res;
}

export function getUserAsObject(): user {
    return getUserData() as unknown as user;
}

export function logOut() {
    localStorage.clear();
}