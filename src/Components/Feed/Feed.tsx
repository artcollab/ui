import React from "react";
import { feed } from "../../Types/Feed";
import Button from "@mui/material/Button";

function Feed(props : feed | null) {
    return (
        <Button variant="outlined" color="primary"> Hello World </Button>
    )
}

export default Feed;