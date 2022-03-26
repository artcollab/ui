import React, { useEffect, useState } from "react";
import './Profile.scss';
import { Avatar, Grid, Box, Modal, IconButton, TextField, InputAdornment, CircularProgress } from "@mui/material";
import { ColorName } from "../../Util/NameColourGenerator";
import { getAccessToken, getUserAsObject } from "../../Util/handleResponse";
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { sendHTTPRequest } from "../../Actions/SendHTTPRequest";
import { user } from "../../Types/User";
import { useParams, useNavigate } from 'react-router-dom'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Chip from '@mui/material/Chip';

const at = getAccessToken();

/* type definitions for the user bio */
type bio = {

    /* bio text string */
    bioText: string;

    /* character limit to restrict the amount of text that is displayed at once for the user bio */
    bioLimit: number;
}

function Profile() {

    const navigate = useNavigate();

    const { userID } = useParams();

    const [User, setUser] = useState<user | undefined>(undefined);

    /* ignore this need to fix bio after getting users */
    const [bioText, setBioText] = useState("");

    useEffect(() => {
        if (typeof (userID) === "string") {

            sendHTTPRequest("GET", "/users/id/" + userID, undefined, JSON.parse(at)).then((responseData) => {
                setUser(JSON.parse(responseData as unknown as string) as user);
            }).catch((err) => {navigate("/error"); console.log(err)});
        }

        if(User) {
            setBioText(User.bio ?? "");
            console.log(User.bio);
        }
    }, [userID])


    if(User) {
        console.log(User.bio);
    }

    /* UserBio constant, used for handling the users bio */
    const UserBio: React.FC<bio>  = ({bioText, bioLimit}) => {

        /* if called, an alert will be displayed showing the users full bio */
        const showText = () => alert(bioText);

        /* if the bio is of an acceptable length then the bio can be shown in full */
        if (bioText.length <= bioLimit) {
            return <>{bioText}</>
        }

        /* constant 'show' which is used for lengthy bio's, this will create a substring from the first character
         * to the defined character limit and will append 3 period characters afterwards */
        const show = bioText.substring(0, bioLimit) + " ..."

        /* clicking on the text when it has been partially hidden will show the full bio in an alert box */
        return <span onClick={showText}>{show}</span>

    }

    /* character limit within the TextField */
    const charLimit = 75

    /* react hook with constant variables to be used to obtain values from the comment text box */
    const [textValue, setValue] = useState(bioText)

    /* react hook for changing the state of the modal */
    const [open, setOpen] = useState(false);

    /* editBio const variable, used for changing the user's bio */
    const editBio =

        /* TextField component, this will allow users to compose and edit their bio at will */
        <TextField

            /* sets TextField background color to white */
            sx={{ color: '#FFF' }}

            /* TextField can expand to multiple lines */
            multiline

            /* maximum rows before turning into scrollable box */
            maxRows={3}

            /* TextField fills the full width of the box */
            fullWidth

            /* placeholder text for when TextField is empty */
            placeholder={'.....'}

            /* value of TextField set to the value of whatever the user types */
            value={textValue}

            /* character count below TextField object */
            helperText={`${textValue.trim().length}/${charLimit}`}

            /* whenever the user types in the TextField the value of the string is saved */
            onChange={(e) => { setValue(e.target.value) }}

            /* props to be used with the user bio (submit button) */
            InputProps={{

                /* styles the input props to be fontSize 13 */
                style: { fontSize: 13 },

                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton style={{ width: 24, height: 24, color: 'black' }} onClick={() => {

                            /* bio can be posted if TextField is empty or has under 75 characters */
                            if (textValue.trim().length >= 0 && textValue.trim().length <= 75) {

                                sendHTTPRequest("POST", "/users/bio", JSON.stringify({ bio: textValue, user_id: userID }),
                                    JSON.parse(at!)).then(() => {setBioText(textValue)}).catch((err) => {console.log(err)});
                                setOpen(false)
                            }

                            /* alerts user of invalid bio (over 75 chars) */
                            else if (textValue.trim().length > 75) { alert("No more than 75 characters allowed.") }
                        }}>
                            <ArrowForwardIcon style={{ color: 'black' }} />
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />

    return (

        <>
            {/* Modal popup menu for bio editing */}
            <Modal className={"bioModal"} open={open} onClose={() => setOpen(false)}>
                <>{editBio}</>
            </Modal>

            {User ? (
                < div className={"profileHeader"}>

                    {/* Grid container used to nicely place the child elements together */}
                    <Grid direction="row" alignItems="center" container wrap="nowrap" spacing={1}>

                        {/* first grid object for the user Avatar */}
                        <Grid item>

                            {/* displays the user's Avatar */}
                            <Avatar src={"/avatarTest.ico"} className={"userAvatar"} sx={{ bgcolor: ColorName(User.name) }} />

                        </Grid>

                        {/* second grid object which for the username and bio text*/}
                        <Grid alignItems="center"  item xs>

                            {/* displays the users username */}
                            <span className={"userName"}>{User.name}{" "}{User.surname}</span>

                            {/* for final version */}
                            {/*{userID != getUserAsObject().id &&*/}

                            {userID == getUserAsObject().id &&
                                <span style={{marginLeft: 10}}>
                                    {/*<Chip className={requestStatus} icon={<PersonAddIcon/>} label="Add friend" onClick={handleRequest}/>*/}
                                </span>
                            }

                            {/*<Chip icon={<PersonRemoveIcon />} label="Remove friend" />*/}


                            {/* line break to separate the username from the bio */}
                            <br />

                            {/* box element which contains the user's bio, this is in a box to break words at a certain
                             position instead of the end of the page */}
                            <Box className={"bio"}>

                                {/* displays the user's written bio with a limit of 40 characters */}
                                <UserBio bioText={bioText} bioLimit={40} />

                                {/* edit button to access the bio editor */}
                                <IconButton onClick={() => setOpen(true)} size={"small"}>
                                    <EditIcon />
                                </IconButton>

                            </Box>

                        </Grid>

                    </Grid>


                    {/* line inserted to separate the header from the posts on the profile page */}
                    <hr className={"headerSeparator"} />
                </div>
            ) :
                <div className={"loadingIcon"}>
                    <CircularProgress size={125} sx={{ color: "#ffccac" }} />
                </div>
            }
        </>
    )
}

export default Profile;
