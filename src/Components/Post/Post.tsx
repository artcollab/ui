import React from "react";
import './Post.scss';
import { post } from "../../Types/Post";
import {Paper} from "@mui/material";

function Post(props : post | undefined) {
    return (
        <Paper elevation={3} className="mainContainer">

        </Paper>
    )
}

export default Post;
