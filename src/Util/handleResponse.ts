export function handleRegisterResponse(response: string) {
    const res = JSON.parse(response);
    localStorage.clear();

    setRefreshToken(res['rt']);
    setAccessToken(res['at']);
    setUserData(res['user']);
}

export function getRefreshToken(): JSON {
    const res = localStorage.getItem('rt');

    return JSON.parse(res ? res : "");
}

export function setRefreshToken(token: JSON) {
    localStorage.setItem('rt', JSON.stringify(token));
}

export function getAccessToken(): JSON {
    const res = localStorage.getItem('at');

    return JSON.parse(res ? res : "");
}

export function setAccessToken(token: JSON) {
    localStorage.setItem('at', JSON.stringify(token));
}

export function setUserData(user: JSON) {
    localStorage.setItem('user', JSON.stringify(user));
}

export function getUserData(): JSON {
    const res = localStorage.getItem('user');

    return JSON.parse(res ? res : "");
}