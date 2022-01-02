import { Badge, IconButton } from "@mui/material";
import MailIcon from '@mui/icons-material/Mail';
import React from "react";

function MessagesMenu() {
    return (
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
            <Badge badgeContent={4} color="error">
                <MailIcon />
            </Badge>
        </IconButton>
    )
}

export default MessagesMenu;