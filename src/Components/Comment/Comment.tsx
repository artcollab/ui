import React from "react";
import {comment} from "../../Types/Comment";
import {Avatar, Box, Container, Grid, Paper} from "@mui/material";

function Comment(props: comment) {

    let userName = props?.user.name
    let userAvatar = <Avatar sx={{bgcolor: "#000080"}}>{props?.user.name.split(' ')[0][0]}</Avatar>
    let userText = props?.text

    return (
        <Container maxWidth="sm">
            <Box sx={{
                wordBreak: 'break-word',
                overflow: 'scroll',
                padding: '10px',
                height: '300px',
                width: '250px',
                border: '3px solid black'
            }}>
                <Paper sx={{maxWidth: 225, my: 1, mx: 'auto', p: 2}}>
                    <Grid container wrap="nowrap" spacing={1.5}>
                        <Grid item>
                            {userAvatar}
                        </Grid>
                        <Grid item xs>
                            {userName} {userText}
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Container>
    )
}

export default Comment;
