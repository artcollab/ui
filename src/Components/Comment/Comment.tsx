/* required components */
import React, { useState } from "react";
import './Comment.scss'
import {comment} from "../../Types/Comment";
import {Avatar, Box, Grid, IconButton, InputAdornment, Paper, TextField} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

type commentProps = {
    commentList : Array<comment>
}

const exampleComment : comment = {
    user: {
        name: "DrawDojo",
        thumbnail: "Thumbnail",
        color: "#fef3bd"
    },
    text: "This is a comment!"
}

/* main Comment function, constructs the Comment component */
function Comment(props : commentProps) {

    /* character limit within the TextField */
    const charLimit = 100;

    /* constant variables to be used to obtain values from the comment text box */
    const [textValue, setValue] = useState('')

    /* constant variables to be used for obtaining user comments */
    const [commentList, setCommentList] = useState<Array<comment>>(props?.commentList);

    /* addComment function to handle the user comments */
    function addComment() {

        /* userComment structure (temp values currently) */
        const userComment: comment = {

            user: {
                name: "",
                thumbnail: "",
                color: ""
            },
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
                                {<Avatar src={"../avatarTest.ico"} sx={{bgcolor: ColorName(exampleComment.user.name)}}>
                                    {exampleComment.user.name.split(' ')[0][0]}
                                </Avatar>}

                            </Grid>

                            {/* comment text displayed next to username */}
                            <Grid item xs>
                                {exampleComment.user.name}
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
                            {<Avatar src={"../avatarTest.ico"} sx={{width: 24, height: 24, bgcolor: ColorName(exampleComment.user.name)}}>
                                {exampleComment.user.name.split(' ')[0][0]}
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
                                else if(textValue.length === 0 ) {alert("No text inputted.")}

                                // TODO: fix space input else if(textValue.trim.length > 0) {alert("No text inputted.")}

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

/* generates a random color background for the user if they don't have a profile picture */
function ColorName(name: string | String | undefined) {

    /* initial varaibles */
    let hash = 0
    let idx = 0
    let color = '#'

    /* default color in unexpected undefined name */
    if(name === undefined) {
        return color + 'f8f8ff'
    }

    /* generates hash value dependent on username */
    while (idx < name.length) {
        hash = name.charCodeAt(idx) + ((hash << 5) - hash)
        idx++
    }

    /* generates the color based on the hash value obtained previously */
    for (idx = 0; idx <= 2; idx++) {
        const randomColVal = (hash >> (idx * 8)) & 0xFF
        color += randomColVal.toString(16)
    }

    return color

}

export default Comment;
