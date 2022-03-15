export function sendHTTPRequest(method: string, url: string, data?: string, at : string = "") {
    const promise = new Promise((resolve, reject) => {
        let expStatus = method === "POST" ? 201 : 200;
        if(url === "/auth/login") expStatus = 200; // kinda ugly but afaik this is the only exception

        const completeURL = `http://localhost:8080${url}`;
        const req = new XMLHttpRequest();

        req.open(method, completeURL, true);
        req.setRequestHeader("Content-Type", "application/json");
        if(at !== "") req.setRequestHeader("Authorization", `Bearer ${at}`);

        req.onreadystatechange = () => {
            if (req.readyState === 4 && req.status === expStatus) {
                resolve(req.response);
            }
            else if(req.responseText) {
                if(JSON.parse(req.responseText)['error']) reject(JSON.parse(req.responseText)['error']);
            }
        };
        data ? req.send(data) : req.send();
    });
    return promise;
}