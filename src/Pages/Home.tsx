import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Components/Login/Login";
import { getAccessToken, getUserData } from "../Util/handleResponse"

export default function Home() {
    const navigate = useNavigate();
    const user = getUserData();
    const at = getAccessToken();

    useEffect(() => {
        if (!user || at === `{"test":true}`) {
            navigate("/login");
            console.log(user);
        }
        else {
            navigate("/feed");
        }
    }, [at, navigate, user])


    return (
        <Login />
    )
}

