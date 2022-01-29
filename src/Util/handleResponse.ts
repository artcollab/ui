import { user } from "../Types/User";

export function handleRegisterResponse(response: string) {
    const res = JSON.parse(response);
    localStorage.clear();

    setRefreshToken(res['rt']);
    setAccessToken(res['at']);
    setUserData(res['user']);
}

export function getRefreshToken(): JSON | null {
    const res = localStorage.getItem('rt');

    return res ? JSON.parse(res) : res;
}

export function setRefreshToken(token: JSON) {
    localStorage.setItem('rt', JSON.stringify(token));
}

export function getAccessToken(): JSON | null {
    const res = localStorage.getItem('at');

    return res ? JSON.parse(res) : res;
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