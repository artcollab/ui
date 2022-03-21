import { Avatar } from "@mui/material";
import { ColorName } from "../../Util/NameColourGenerator";

type letterAvatarProps = {
    firstName: string,
    surname: string
}

function LetterAvatar(props : letterAvatarProps) {
    return (
        <Avatar sx={{ bgcolor: ColorName(`${props.firstName} ${props.surname}`) }}>{props.firstName.charAt(0)}{props.surname.charAt(0)}</Avatar>
    )
}

export default LetterAvatar;