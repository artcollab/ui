import Feed from "../Components/Feed/Feed";
import Login from "../Components/Login/Login";
import { getUserData } from "../Util/handleResponse"

export default function Home() {
    const user = getUserData();

    return (
        <>
            {user ?
                <Feed /> :
                <Login/>
            }
        </>
    )
}

