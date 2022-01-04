/* required components */
import React, { useState } from "react";
import {comment} from "../../Types/Comment";
import {Avatar, Box, Grid, IconButton, InputAdornment, Paper, TextField} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/* main Comment function, constructs the Comment component */
function Comment(props : comment | undefined) {

    /* constant variables to be used to obtain values from the comment text box */
    const [textValue, setValue] = useState('')

    /* constant variables to be used for obtaining user comments */
    const [commentList, setCommentList] = useState<Array<comment>>([]);

    /* addComment function to handle the user comments */
    function addComment() {

        /* userComment structure (temp values currently) */
        const userComment: comment = {

            user: {
                name: "",
                thumbnail: ""
            },
            text: textValue

        };

        /* creates a comment array containing the comments within the commentList */
        const commentArr: Array<comment> = [...commentList];

        /* pushes/adds the new userComment into this comment array */
        commentArr.push(userComment)

        /* adds this array & all the values within it into setCommentList */
        setCommentList(commentArr)
    }

    return (

        /* creates a Box component which will contain Comments from users */
        <Box sx={{
            position: 'absolute', top: '225px', right: '175px',
            wordBreak: 'break-word', overflow: 'auto', padding: '10px',
            height: '300px', width: '250px',
            border: '3px solid black', borderRadius: 2.5
        }}>

            {/* obtains a user's comment object from the react hook containing the list of comments */}
            {commentList.map((c) => {
                return (
                    /* creates a paper card in which the users comment is displayed with their profile picture, username & comment text */
                    <Paper sx={{maxWidth: 225, my: 1, mx: 'auto', p: 2, borderRadius: 2.5}}>
                        <Grid container wrap="nowrap" spacing={1.5}>
                            <Grid item>
                                {<Avatar src={"../favicon.ico"} sx={{bgcolor: ColorName()}}>{props?.user.name.split(' ')[0][0]}</Avatar>}
                            </Grid>
                            <Grid item xs>
                                {props?.user.name} {'- ' + c.text}
                            </Grid>
                        </Grid>
                    </Paper>
                )
            })}

            {/* TextField component, this will allow users to compose and post comments within the Comment component*/}
            <TextField

                /* TextField CSS Specifications */
                sx={{bottom: '0px'}} id="outlined-multiline-flexible"
                multiline maxRows={3} fullWidth={true}
                placeholder={'.....'} value={textValue}

                /* whenever the user types in the TextField the value of the string is saved */
                onChange={(e) => {setValue(e.target.value)}}

                /* Props to be used with the Comment text box such as showing user profile picture */
                InputProps={{

                    /* at the beginning of the TextField the users profile picture will be displayed if they have one,
                    * if they don't then a random one is generated for them based on username */
                    startAdornment: (
                        <InputAdornment position="start">
                            {<Avatar src={"../favicon.ico"} sx={{width: 24, height: 24, bgcolor: ColorName()
                            }}>{props?.user.name.split(' ')[0][0]}</Avatar>}
                        </InputAdornment>
                    ),

                    /* at the end of the TextField an arrow is displayed which allows the user to post their comment */
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton color={"success"} onClick={addComment}><ArrowForwardIcon/></IconButton>
                        </InputAdornment>
                    ),
                }}
            />

        </Box>
    )
}

/* generates a random color background for the user if they don't have a profile picture */
function ColorName() {

    let randomVal = Math.floor(Math.random() * 0xFFFFFF);
    return "#" + randomVal.toString(16);

}

export default Comment;
