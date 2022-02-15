import React from "react";
import { profile } from "../../Types/Profile";
import './Profile.scss';
import {Avatar, Grid, Box} from "@mui/material";
import {ColorName} from "../../Util/NameColourGenerator";
import {user} from "../../Types/User";
import {getUserAsObject} from "../../Util/handleResponse";

/* temporary user object */
const tempUser: user = {
    id: "",
    username: "",
    email: "",
    name: "",
    surname: "",
    password: ""
}

const fetchUser = getUserAsObject();

const User = fetchUser ? fetchUser : tempUser;

/* temporary user bio for testing purposes */
const userBio = "wasdwasdwasd wasd wasd wasd wasdwasdwswas"

/* type definitions for the user bio */
type bio = {

    /* bio text string */
    bioText : string;

    /* character limit to restrict the amount of text that is displayed at once for the user bio */
    bioLimit : number;
}

function Profile(props : profile) {

    /* UserBio constant, used for handling the users bio */
    const UserBio : React.FC<bio> = ({bioText, bioLimit}) => {

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

    return (
        <>

            {/* divider which stores the profile header elements */}
            <div className={"profileHeader"}>

                {/* Grid container used to nicely place the child elements together */}
                <Grid direction="row" alignItems="center" container wrap="nowrap" spacing={1}>

                    {/* first grid object for the user Avatar */}
                    <Grid item>

                        {/* displays the user's Avatar */}
                        <Avatar src={"../avatarTest.ico"} className={"userAvatar"} sx={{bgcolor: ColorName(User.name)}}/>

                    </Grid>


                    {/* second grid object which for the username and bio text*/}
                    <Grid item xs>

                        {/* displays the users username */}
                        <span className={"userName"}>{User.name}</span>

                        {/* line break to separate the username from the bio */}
                        <br/>

                        {/* box element which contains the user's bio, this is in a box to break words at a certain
                         position instead of the end of the page */}
                        <Box className={"bio"}>

                            {/* displays the user's written bio with a limit of 35 characters */}
                            <UserBio bioText={userBio} bioLimit={35}/>

                        </Box>

                    </Grid>

                </Grid>


                {/* line inserted to separate the header from the posts on the profile page */}
                <hr className={"headerSeparator"}/>

            </div>
        </>
    )
}

export default Profile;
