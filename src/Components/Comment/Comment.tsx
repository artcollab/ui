/* required components */
import React, {useState} from "react";
import {comment} from "../../Types/Comment";
import {Avatar, Box, Grid, IconButton, InputAdornment, Paper, TextField} from "@mui/material";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/* main Comment function, constructs the Comment component */
function Comment(props: comment) {

    /* constant variables to be used to obtain values from the comment text box */
    const [textValue, setValue] = useState('')

    return (

        /* creates a Box component which will contain Comments from users */
        <Box sx={{
            /* Box CSS specifications */
            position: 'absolute', top: '225px', right: '175px',
            wordBreak: 'break-word', overflow: 'auto', padding: '10px',
            height: '300px', width: '250px',
            border: '3px solid black', borderRadius: 2.5
        }}>

            {/* TextField component, this will allow users to compose and post comments within the Comment component*/}
            <TextField
                /* TextField CSS Specifications */
                sx={{bottom: '0px'}} id="outlined-multiline-flexible"
                multiline maxRows={3} fullWidth={true}
                placeholder={'.....'} value={textValue}
                onChange={(e) => {setValue(e.target.value)}}

                /* Props to be used with the Comment text box such as showing user profile picture */
                InputProps={{

                    /* at the beginning of the TextField the users profile picture will be displayed if they have one,
                    * if they don't then a random one is generated for them based on username */
                    startAdornment: (
                        <InputAdornment position="start">
                            {<Avatar src={"../dog.jpg"} sx={{width: 24, height: 24, bgcolor: colorName()
                            }}>{props?.user.name.split(' ')[0][0]}</Avatar>}
                        </InputAdornment>
                    ),

                    /* at the end of the TextField an arrow is displayed which allows the user to post their comment */
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton color={"success"} onClick={() => postComment(props, textValue)}><ArrowForwardIcon/></IconButton>
                        </InputAdornment>
                    ),
                }}
            />
        </Box>
    )
}

/* generates a random color background for the user if they don't have a profile picture */
function colorName() {

    let randomVal = Math.floor(Math.random() * 0xFFFFFF);
    return "#" + randomVal.toString(16);

}

/* posts the users comment within the component */
function postComment(props: { user: any; text: any; }, value: {} | null | undefined) {

    /* creates a paper card in which the users comment is displayed with their profile picture, username & comment text */
    return (<Paper sx={{maxWidth: 225, my: 1, mx: 'auto', p: 2, borderRadius: 2.5}}>
        <Grid container wrap="nowrap" spacing={1.5}>
            <Grid item>
                {<Avatar src={"../dog.jpg"} sx={{bgcolor: colorName()}}>{props?.user.name.split(' ')[0][0]}</Avatar>}
            </Grid>
            <Grid item xs>
                {props?.user.name} {'- ' + value}
            </Grid>
        </Grid>
    </Paper>)

}

export default Comment;
