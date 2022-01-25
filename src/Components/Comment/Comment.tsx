/* required components */
import React, { useState } from "react";
import './Comment.scss'
import {comment} from "../../Types/Comment";
import {Avatar, Box, Grid, IconButton, InputAdornment, Paper, TextField} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { ColorName } from "../../Util/NameColourGenerator";

/* commentProps type, commentList is made into an Array of comment variables to create a functioning comment section */
type commentProps = {
    commentList : Array<comment>
}

/* tempComment constant, to be used for testing until DB is up */
const tempComment : comment = {
    user: {
        id: "",
        name: "DrawDojo",
        thumbnail: "",
        color: ""
    },
    text: ""
}

/* main Comment function, constructs the Comment component */
function Comment(props : commentProps) {

    /* character limit within the TextField */
    const charLimit = 100;

    /* react hook with constant variables to be used to obtain values from the comment text box */
    const [textValue, setValue] = useState('')

    /* react hook with constant variables to be used for obtaining user comments */
    const [commentList, setCommentList] = useState<Array<comment>>(props?.commentList);

    /* addComment function to handle the user comments */
    function addComment() {

        /* userComment structure (temp values currently) */
        const userComment: comment = {

            user: tempComment.user,
            text: textValue

        };

        /* creates a comment array containing the comments within the commentList */
        const commentArr: Array<comment> = [...commentList];

        /* pushes/adds the new userComment into this comment array */
        commentArr.push(userComment)

        /* adds this array & all the values within it into setCommentList */
        setCommentList(commentArr)

        /* clears TextField once comment has been made */
        setValue("")

    }

    return (

        /* creates a Box component which will contain Comments from users */
        <Box className={"commentBox"}>

            {/* obtains a user's comment object from the react hook containing the list of comments */}
            {commentList.map((c, i) => {

                return (
                    /* creates a paper card in which the users comment is displayed with their profile picture, username & comment text */
                    <Paper key={i} sx={{maxWidth: 225, my: 1, mx: 'auto', p: 2, borderRadius: 2.5}}>

                        {/* aligns items in the center of the Paper container */}
                        <Grid direction="row" alignItems="center" container wrap="nowrap" spacing={1.5}>

                            {/* user Avatar icon */}
                            <Grid item>

                                {/* generates the users avatar icon for use within the TextField */}
                                {<Avatar src={"../avatarTest.ico"} sx={{bgcolor: ColorName(tempComment.user.name)}}>
                                    {tempComment.user.name.split(' ')[0][0]}
                                </Avatar>}

                            </Grid>

                            {/* comment text displayed next to username */}
                            <Grid item xs>
                                {tempComment.user.name}
                                {' - ' + c.text}
                            </Grid>
                        </Grid>
                    </Paper>
                )
            })}

            {/* TextField component, this will allow users to compose and post comments within the Comment component*/}
            <TextField

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

                /* character count below TextField object*/
                helperText={`${textValue.length}/${charLimit}`}

                /* whenever the user types in the TextField the value of the string is saved */
                onChange={(e) => {setValue(e.target.value)}}

                /* Props to be used with the Comment text box such as showing user profile picture */
                InputProps={{

                    /* at the beginning of the TextField the users profile picture will be displayed if they have one,
                    * if they don't then a random one is generated for them based on username */
                    startAdornment: (
                        <InputAdornment position="start">
                            {<Avatar src={"../avatarTest.ico"} sx={{width: 24, height: 24, bgcolor: ColorName(tempComment.user.name)}}>
                                {tempComment.user.name.split(' ')[0][0]}
                            </Avatar>}
                        </InputAdornment>
                    ),

                    /* at the end of the TextField an arrow is displayed which allows the user to post their comment */
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton color={"success"} onClick={() => {

                                /* comment can be posted if TextField isn't empty or has under 100 characters */
                                if(textValue.length > 0 && textValue.length <= 100) { addComment() }

                                /* alerts user of invalid comment (no text) */
                                else if(textValue.trim.length === 0 ) {alert("No text inputted.")}

                                /* alerts user of invalid comment (too many chars) */
                                else {alert("No more than 100 characters allowed.")}
                            }}>
                                <ArrowForwardIcon/>
                            </IconButton>
                        </InputAdornment>
                    )
                }}
            />

        </Box>
    )
}

export default Comment;
