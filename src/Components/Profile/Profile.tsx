import React, {useEffect, useState} from "react";
import './Profile.scss';
import {Avatar, Grid, Box, Modal, IconButton, TextField, InputAdornment, CircularProgress} from "@mui/material";
import {ColorName} from "../../Util/NameColourGenerator";
import {getAccessToken, getUserAsObject} from "../../Util/handleResponse";
import {sendHTTPRequest} from "../../Actions/SendHTTPRequest";
import {user} from "../../Types/User";
import {useParams, useNavigate} from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const at = getAccessToken();

/* type definitions for the user bio */
type bio = {

    /* bio text string */
    bioText: string;

    /* character limit to restrict the amount of text that is displayed at once for the user bio */
    bioLimit: number;
}

function Profile() {

    /* navigate const for moving to error page on bad fetch of user */
    const navigate = useNavigate();

    /* obtains the userID from the current URL */
    const {userID} = useParams();

    /* User React hook for handling the retrieved user object from the backend,
    * this can be undefined during the fetch process */
    const [User, setUser] = useState<user | undefined>(undefined);

    /* bioText hook for handling the users bio */
    const [bioText, setBioText] = useState("");

    /* obtains the User object through their ID from the backend and sets found information through hooks  */
    useEffect(() => {
        if (typeof (userID) === "string" && !User) {
            sendHTTPRequest("GET", "/users/id/" + userID, undefined, JSON.parse(at)).then((responseData) => {
                let fetchedUser = JSON.parse(responseData as unknown as string) as user;
                setUser(fetchedUser);
                setBioText(fetchedUser.bio ?? "");

            }).catch((err) => {
                navigate("/error");
                console.log(err)
            });
        }
    }, [User, navigate, userID])

    /* react hook for changing the state of the modal */
    const [open, setOpen] = useState(false);

    /* UserBio constant, used for handling the users bio */
    const UserBio: React.FC<bio> = ({bioText, bioLimit}) => {

        /* if the bio is of an acceptable length then the bio can be shown in full */
        if (bioText.length <= bioLimit) {
            return <>{bioText}</>
        }

        /* constant 'show' which is used for lengthy bio's, this will create a substring from the first character
         * to the defined character limit and will append 3 period characters afterwards */
        const show = bioText.substring(0, bioLimit) + " ..."

        /* if called, an alert will be displayed showing the users full bio */
        const showText = () => alert(bioText);

        /* clicking on the text when it has been partially hidden will show the full bio in an alert box */
        return <span onClick={showText}>{show}</span>

    }

    /* character limit within the TextField set to 75 chars */
    const charLimit = 75

    /* textValue hook for use with the TextField allowing users to edit their bios */
    const [textValue, setValue] = useState(bioText)

    /* editBio const variable, used for changing the user's bio */
    const editBio =

        /* TextField component, this will allow users to compose and edit their bio at will */
        <TextField

            /* sets TextField background color to white */
            sx={{color: '#FFF'}}

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
            onChange={(e) => {
                setValue(e.target.value)
            }}

            /* props to be used with the user bio (submit button) */
            InputProps={{

                /* styles the input props to be fontSize 13 */
                style: {fontSize: 13},

                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton style={{width: 24, height: 24, color: 'black'}} onClick={() => {

                            /* bio can be posted if TextField is empty or has under 75 characters */
                            if (textValue.trim().length >= 0 && textValue.trim().length <= charLimit) {

                                /* Posts the users edited bio to the backend so it can be stashed */
                                sendHTTPRequest("POST", "/users/bio", JSON.stringify({bio: textValue, user_id: userID}),
                                    JSON.parse(at!)).then(() => {
                                    setBioText(textValue)
                                }).catch((err) => {
                                    console.log(err)
                                });

                                /* on submission of edited bio the modal will close */
                                setOpen(false)
                            }

                            /* alerts user of invalid bio (over 75 chars) */
                            else if (textValue.trim().length > 75) {
                                alert("No more than 75 characters allowed.")
                            }

                        }}>
                            <ArrowForwardIcon style={{color: 'black'}}/>
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
                    <div className={"profileHeader"}>

                        {/* Grid container used to nicely place the child elements together */}
                        <Grid direction="row" alignItems="center" container wrap="nowrap" spacing={1}>

                            {/* first grid object for the user Avatar */}
                            <Grid item>

                                {/* displays the user's Avatar */}
                                <Avatar src={"/avatarTest.ico"} className={"userAvatar"} sx={{bgcolor: ColorName(User.name)}}/>

                            </Grid>

                            {/* second grid object which for the username and bio text*/}
                            <Grid alignItems="center" item xs>

                                {/* displays the users username */}
                                <span className={"userName"}>{User.name}{" "}{User.surname}</span>

                                {/* line break to separate the username from the bio */}
                                <br/>

                                {/* box element which contains the user's bio, this is in a box to break words at a certain
                                 position instead of the end of the page */}
                                <Box className={"bio"}>

                                    {/* displays the user's written bio with a limit of 40 characters */}
                                    <UserBio bioText={bioText} bioLimit={40}/>

                                    {/* edit button to access the bio editor */}
                                    <IconButton onClick={() => setOpen(true)} size={"small"}>
                                        <EditIcon/>
                                    </IconButton>

                                </Box>

                            </Grid>

                        </Grid>

                        {/* line inserted to separate the header from the posts on the profile page */}
                        <hr className={"headerSeparator"}/>
                    </div>

                ) :

                /* loading icon displayed when the User object is undefined (being fetched) */
                <div className={"loadingIcon"}>
                    <CircularProgress size={125} sx={{color: "#ffccac"}}/>
                </div>
            }
        </>
    )
}

export default Profile;
