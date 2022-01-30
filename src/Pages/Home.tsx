import Feed from "../Components/Feed/Feed";
import Register from "../Components/Register/Register";
import { getUserData } from "../Util/handleResponse"

export default function Home() {
    const user = getUserData();

    return (
        <>
            {user ?
                <Feed /> :
                <Register />
            }
        </>
    )
}
