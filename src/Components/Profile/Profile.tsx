import React, {useEffect, useState} from "react";
import './Profile.scss';
import {Avatar, Grid, Box, Modal, IconButton, TextField, InputAdornment, CircularProgress, Chip, ImageList, ImageListItem, ImageListItemBar} from "@mui/material";
import {ColorName} from "../../Util/NameColourGenerator";
import {getAccessToken, getUserAsObject} from "../../Util/handleResponse";
import {sendHTTPRequest} from "../../Actions/SendHTTPRequest";
import {user} from "../../Types/User";
import {profile} from "../../Types/Profile";
import {useParams, useNavigate} from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PendingIcon from '@mui/icons-material/Pending';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import { post } from "../../Types/Post";

const at = getAccessToken();

const myUser = getUserAsObject();

/* type definitions for the user bio */
type bio = {

    /* bio text string */
    bioText: string;

    /* character limit to restrict the amount of text that is displayed at once for the user bio */
    bioLimit: number;
}

function Profile() {

    /* navigate const for moving to error page on bad fetch of profiel */
    const navigate = useNavigate();

    /* obtains the profileID from the current URL */
    const {profileID} = useParams();

    /* Profile React hook for handling the retrieved profile object from the backend,
    * this can be undefined during the fetch process */
    const [Profile, setProfile] = useState<profile | undefined>(undefined);

    /* bioText hook for handling the users bio */
    const [bioText, setBioText] = useState("");

    /* textValue hook for use with the TextField allowing users to edit their bios */
    const [textValue, setValue] = useState("")

    const [posts, setPosts] = useState<Array<post>>([]);

    /* obtains the profile object through it's ID from the backend and sets found information through hooks  */
    useEffect(() => {
        if (typeof (profileID) === "string" && !Profile) {
            sendHTTPRequest("GET", "/users/profile/" + profileID, undefined, JSON.parse(at)).then((responseData) => {
                let fetchedProfile = JSON.parse(responseData as unknown as string) as profile;
                setProfile(fetchedProfile);
                setBioText(fetchedProfile.user.bio ?? "");
                setValue(fetchedProfile.user.bio ?? "");
                setPosts(fetchedProfile.posts ?? "");

            }).catch((err) => {
                navigate("/error");
                console.log(err)
            });
        }
    }, [Profile, navigate, profileID, posts])

    // sendHTTPRequest("GET", "/users/friends/" + userID + "/requests/to", undefined, JSON.parse(at)).then((responseData) => {
    //     setRequestStatus(JSON.parse(responseData as unknown as string));
    // }).catch((err) => {console.log(err)});;


    function contentHandler(content : string) {

        let blob = new Blob([content], { type: 'image/svg+xml' });
        let url = URL.createObjectURL(blob);
        let image = document.createElement('img'); image.addEventListener('load', () => {URL.revokeObjectURL(url)}, { once: true }); image.src = url;
        return image.src;

    }


    /* TODO: The follow hooks have placeholder values currently, need to retrieve the request status from the backend */

    /* requestStatus hook for the chip label text */
    const [requestStatus, setRequestStatus] = useState("Add Friend");

    /* requestStatusStyle hook for the chip style depending on its state */
    const [requestStatusStyle, setRequestStatusStyle] = useState("addFriend");

    /* requestStatusIcon hook for the chip's icon depending on request state */
    const [requestStatusIcon, setRequestStatusIcon] = useState(<PersonAddIcon/>);

    /* handles sending of friend requests & removal of friends */
    function handleRequest() {

        /* can only send a request if the label text is Add Friend */
        if(requestStatus === "Add Friend") {

            setRequestStatusIcon(<PendingIcon/>);
            setRequestStatus("Pending");
            setRequestStatusStyle("pending");
            
            /* changes the request status to pending as the request is processed */
            if (Profile) {
                sendHTTPRequest("POST", "/users/friends/request", JSON.stringify({
                        from: myUser.username,
                        to: Profile.user.username,
                    }),
                    JSON.parse(at!)).then(() => {
                }).catch((err) => {
                    console.log(err)
                });
            }


        }

        /* TODO: Ask Oli if backend supports cancellation */

        /* cancels request if it's already pending */
        if(requestStatus === "Pending") {

            /* changes the request status to add friend as the request has been cancelled */
            setRequestStatus("Pending");
            setRequestStatusStyle("pending");
            setRequestStatusIcon(<PendingIcon/>);

            /* TODO: Post request here into backend */

        }
    }

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
                                if (Profile) {
                                    sendHTTPRequest("POST", "/users/bio", JSON.stringify({
                                            bio: textValue,
                                            user_id: Profile.user.id
                                        }),
                                        JSON.parse(at!)).then(() => {
                                        setBioText(textValue)
                                    }).catch((err) => {
                                        console.log(err)
                                    });
                                }

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

            {Profile ? (
                    <div className={"profileHeader"}>

                        {/* Grid container used to nicely place the child elements together */}
                        <Grid direction="row" alignItems="center" container wrap="nowrap" spacing={1}>

                            {/* first grid object for the user Avatar */}
                            <Grid item>

                                {/* displays the user's Avatar */}
                                <Avatar className={"userAvatar"} sx={{ bgcolor: ColorName(`${Profile.user.name} ${Profile.user.surname}`)}}>
                                    <div style={{fontSize: 100}}>{Profile.user.name.charAt(0)}{Profile.user.surname.charAt(0)}</div>
                                </Avatar>

                            </Grid>

                            {/* second grid object which for the username and bio text*/}
                            <Grid item xs>

                                {/* displays the users username */}
                                <span className={"userName"}>{Profile.user.name}{" "}{Profile.user.surname}</span>

                                {/* line break to separate the username from the bio */}
                                <br/>

                                {/* box element which contains the user's bio, this is in a box to break words at a certain
                                 position instead of the end of the page */}
                                <Box className={"bio"}>

                                    {/* displays the user's written bio with a limit of 40 characters */}
                                    <UserBio bioText={bioText} bioLimit={40}/>

                                    {/* edit button to access the bio editor, only appears on the users own profile */}
                                    {profileID === Profile.user.profileID &&
                                        <IconButton onClick={() => setOpen(true)} size={"small"}>
                                            <EditIcon/>
                                        </IconButton>
                                    }

                                </Box>

                                {/* spacing stuff out */}
                                <br/>


                                {/* for final version, using inverse of this for testing purposes currently*/}
                                {/*{userID != getUserAsObject().id &&*/}

                                {/* request chip button, handles sending friend requests as well as TODO: removing friends */}
                                {profileID === Profile.user.profileID &&
                                    <Chip className={requestStatusStyle} color="primary" icon={requestStatusIcon} label={requestStatus} onClick={handleRequest}/>
                                }

                            </Grid>
                        </Grid>

                        {/* line inserted to separate the header from the posts on the profile page */}
                        <hr className={"headerSeparator"}/>

                        <Box className={"profilePosts"}>
                            <ImageList variant="masonry" cols={3} gap={5}>
                                {posts.map((item) => (
                                    <ImageListItem  key={item.content}>
                                        <img
                                            src={contentHandler(item.content)}
                                            srcSet={contentHandler(item.content)}
                                            alt={item.title}
                                            loading="lazy"
                                            draggable={false}
                                        />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </Box>

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
