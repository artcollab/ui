import { getUserAsObject } from "../Util/handleResponse";

const user = getUserAsObject();

export function handlePost(content : string, caption: string): void{
    const Post = {
        user_id: user.id,
        title: caption,
        content: content,
    }
    const body = JSON.stringify(Post);
    const url = "https://api.operce.net/posts";
    const req = new XMLHttpRequest();
    // open async http post request
    req.open("POST", url, true); 
    req.setRequestHeader("Content-Type", "application/json");
    req.onreadystatechange = () => {
        if(req.readyState === 4 && req.status === 201) {
            // on successful register, add response to localstorage
            console.log(JSON.parse(req.response));
            localStorage.setItem('post', JSON.parse(req.response));
        }
        else{
            console.log(req);
        }
    };
    req.send(body);

}