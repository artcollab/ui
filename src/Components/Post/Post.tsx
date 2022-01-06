import React, {useState} from "react";
import './Post.scss';
import Comment from '../Comment/Comment';
import {Button, Container, Paper} from "@mui/material";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Modal from '@mui/material/Modal';
    
function Post() {

    /* react hook for changing the state of the modal */
    const [open, setOpen] = useState(false);

    /* comment component */
    const commentSection = <Comment text={"This is a comment!"} user={{name: "DrawDojo", thumbnail: "Thumbnail", color: "#fef3bd"}}/>

    return (

        /* container which holds all components relevant to this Post component */
        <Container>

            {/* Paper component for the main post container */}
            <Paper style={{padding: 10}} className="mainContainer">

                {/* divider for the comment section displayed within the main container, on the right (desktop ver) */}
                <div className={"desktopComment"}>
                    {commentSection}
                </div>

            </Paper>

            {/* divider for handling the comment section component for mobile users */}
            <div className={"mobileComment"}>

                {/* Button component which can be pressed to display the comment section in a Modal */}
                <Button onClick={() => setOpen(true)} disableRipple sx={{'&:hover': {bgcolor: "transparent"}, marginLeft: "auto"}}>

                    {/* uses a simple chat bubble icon depicting where mobile users can access comments */}
                    <ChatBubbleIcon sx={{ color: "#f1b128",  fontSize: 50}}/>

                </Button>

                {/* Modal popup menu for the comment section component */}
                <Modal className={"commentModal"} open={open} onClose={() => setOpen(false)}>
                    {commentSection}
                </Modal>

            </div>

        </Container>
    )
}

export default Post;
