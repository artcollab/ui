import React, {useState} from "react";
import './Post.scss';
import Comment from '../Comment/Comment';
import {Avatar, Button, Container, Grid, IconButton, Paper, Tooltip, Zoom} from "@mui/material";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Modal from '@mui/material/Modal';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CreateIcon from '@mui/icons-material/Create';

/* type definitions for caption variables, need to avoid errors */
interface CaptionInterface {

    /* caption text string */
    captionText : string;

    /* character limit to restrict the amount of text that is displayed at once */
    characterLimit : number;
}

function Post(this: any) {

    /* PostCaption constant definition, this will be used for handling the caption text */
    const PostCaption : React.FC<CaptionInterface> = ({captionText, characterLimit}) => {

        /* if this is called then an alert will be displayed showing the full caption */
        const showText = () => alert(captionText);

        /* if the length is acceptable then the caption can be displayed as normal */
        if (captionText.length <= characterLimit) {
            return <>{captionText}</>
        }

        /* show constant for use when the caption is too long, creates a substring from the first character to
        * the set character limit & appends 3 periods afterwards */
        const show = captionText.substring(0, characterLimit) + " ..."

        /* clicking anywhere on the text will show the full string if its been hidden */
        return <a onClick={showText}>{show}</a>

    }

    /* React hook for handling the amount of likes on the post */
    const [likes, setLikes] = useState(777)

    /* React hook for handling the state of the like on the post (whether user has liked or not) */
    const [liked, setLiked] = useState(false)

    /* event handling for liking the post (clicking like button) */
    const onLike = () => {

            /* sets the value of the likes depending on status of the like button, if the post
            * has already been liked then the number is reduced to stop from posts being liked
            * multiple times, otherwise then the like amount is incremented */
            setLikes(likes + (liked ? -1 : 1));

            /* sets the status of liked to true (initially false) as the post has now been liked by the user */
            setLiked(!liked);
    };

    /* react hook for changing the state of the modal */
    const [open, setOpen] = useState(false);

    /* Testing purposes */
    // const tempComment : comment = {user: {name: "DrawDojo", thumbnail: "", color: ""}, text: "Test"}

    /* comment component */
    const commentSection = <Comment commentList={[]}/>

    return (

        /* container which holds all components relevant to this Post component */
        <Container>

            {/* Paper component for the square post container */}
            <Paper style={{padding: 10}} className="squareContainer">

                {/* Temporary image component, this will be pulled from backend when available  */}
                <img draggable={"false"} className={"squarePostContent"} src={"../art2.jpeg"} alt={"Error..."}/>

                {/* Modal popup menu for the comment section component */}
                <Modal className={"commentModal"} open={open} onClose={() => setOpen(false)}>
                    {commentSection}
                </Modal>

                {/* divider for the comment section displayed within the main container, on the right (desktop ver) */}
                <div className={"desktopComment"}>
                    {commentSection}
                </div>

                {/* postHeader divider, holds all components related to the header of a post */}
                <div className="postHeader">

                    {/* Grid container created to hold the components of this header, they will be aligned with each-other  */}
                    <Grid direction="row" alignItems="center" container wrap="nowrap" spacing={1.5}>

                        <Grid item>

                            {/* displays the avatar of the post author */}
                            <Avatar src={"../cat.jpg"} sx={{width: 56, height: 56}}/>

                            {/* DB EXAMPLE:
                            {author.user.name.split(' ')[0][0]}
                            </Avatar>}
                            */}

                        </Grid>

                        <Grid item xs>

                            {/* authors username, displayed in bold text to emphasise */}
                            <p style={{fontWeight: "bold", margin: 0, padding: 0}}>dogs72</p>

                            {/* line underneath the authors username to separate it from caption text */}
                            <hr/>

                            {/* handles the post caption in the desktop view */}
                            <div className={'postCaptionDesktop'}>

                                {/* in the desktop view there has to be a limit on the amount of characters due to the limited size
                                 of the post container, this character limit is 15 characters as of now */}
                                <PostCaption captionText = "the quick round frog jumps over the lazy hog" characterLimit = {15}/>

                            </div>

                            {/* handles the post caption in the mobile view */}
                            <div className={'postCaptionMobile'}>

                                {/* as of now text can be displayed as normal in full underneath the mobile post container, there
                                may be a word limit imposed later */}
                                {"the quick round frog jumps over the lazy hog"}

                            </div>

                        </Grid>
                    </Grid>
                </div>

                {/* divider for handling desktop post interaction e.g. likes */}
                <div className={"desktopPostInteraction"}>

                    {/* Grid container used here to easily align these components horizontally */}
                    <Grid direction="row" alignItems="center" container wrap="nowrap">

                        <Grid item>

                            {/* Tooltip element to show the likes on the current post instead of them always showing, keeps the container compact */}
                            <Tooltip followCursor TransitionComponent={Zoom} title={likes}>

                                {/* button for the like component, currently a dark grey smiley emoji (needs to change with theme) */}
                                <IconButton onClick={onLike} sx={{}}><EmojiEmotionsIcon sx={{fontSize: '30px', color: "#42342c"}}/></IconButton>

                            </Tooltip>

                            {/* button for the comment component, should focus on commentTextField when clicked (needs to change with theme) */}
                            <IconButton sx={{marginLeft: '35px'}}><ChatBubbleIcon sx={{fontSize: '30px', color: "#42342c"}}/></IconButton>

                            {/* button for the edit component, not implemented yet (needs to change with theme) */}
                            <IconButton sx={{marginLeft: '35px'}}><CreateIcon sx={{fontSize: '30px', color: "#42342c"}}/></IconButton>

                        </Grid>
                    </Grid>
                </div>

            </Paper>

            {/* divider for handling the comment section component for mobile users */}
            <div className={"mobileComment"}>

                {/* Button component which can be pressed to display the comment section in a Modal */}
                <Button onClick={() => setOpen(true)} disableRipple sx={{'&:hover': {bgcolor: "transparent"}, marginLeft: "auto"}}>

                    {/* uses a simple chat bubble icon depicting where mobile users can access comments */}
                    <ChatBubbleIcon sx={{ color: "#42342c",  fontSize: 50}}/>

                </Button>

            </div>
        </Container>
    )
}

export default Post;
