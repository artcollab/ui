import { post } from "../Types/Post";
import { getAccessToken, getUserAsObject } from "../Util/handleResponse";

const at = getAccessToken();
const user = getUserAsObject();

export function handlePost(content : string, caption: string): void{
    const Post = {
        author: user,
        title: caption,
        content: content,
    }
    const body = JSON.stringify(Post);
    const url = "http://localhost:8080/posts";
    const req = new XMLHttpRequest();
    // open async http post request
    req.open("POST", url, true); 
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader('Authorization', "Bearer " + JSON.parse(at));
    req.onreadystatechange = () => {
        if(req.readyState === 4 && req.status === 201) {
            console.log("Success creating post");
        }
    };
    req.send(body);

}

export function fetchPosts() : Array<post> {
    let res : post[] = [];
    const url = "http://localhost:8080/posts";
    const req = new XMLHttpRequest();
    // open async http post request
    req.open("GET", url, true); 
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader('Authorization', "Bearer " + JSON.parse(at));
    req.onreadystatechange = () => {
        if(req.readyState === 4 && req.status === 200) {
            //console.log(JSON.parse(req.response));
            res = JSON.parse(req.response) as unknown as Array<post>;
            return res;
        }
    };
    req.send();

    return res;
}