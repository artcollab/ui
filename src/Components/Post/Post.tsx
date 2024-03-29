import React, { useState } from "react";
import './Post.scss';
import Comment from '../Comment/Comment'
import {post} from "../../Types/Post";
import {Avatar, Container, Grid, IconButton, Paper, Tooltip, Zoom} from "@mui/material";
import {ColorName} from "../../Util/NameColourGenerator";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import Modal from '@mui/material/Modal';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from "react-router-dom";
import { generateRoomID } from "../../Util/generateRoomID";
import { sendHTTPRequest } from "../../Actions/SendHTTPRequest";
import { getAccessToken, getUserAsObject } from "../../Util/handleResponse";

/* postProps type defined */
type postProps = {

    /* Post element for when DB is available */
    Post: post
}

/* type definitions for caption variables, need to avoid errors */
type caption = {

    /* caption text string */
    captionText: string;

    /* character limit to restrict the amount of text that is displayed at once */
    characterLimit: number;
}

const user = getUserAsObject();
const at = getAccessToken();

function Post(props: postProps) {

    const navigate = useNavigate();

    /* obtains the actual post from the backend */
    const post = props.Post;

    /* postSize variable, this will pull from the database to determine the container type to render */
    const postSize = post.size;

    const svg = post.content;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const image = document.createElement('img'); image.addEventListener('load', () => {URL.revokeObjectURL(url)}, { once: true }); image.src = url;

    /* PostCaption constant definition, this will be used for handling the caption text */
    const PostCaption: React.FC<caption> = ({ captionText, characterLimit }) => {

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
        return <span onClick={showText}>{show}</span>

    }

    /* React hook for handling the amount of likes on the post */
    const [likes, setLikes] = useState(post.likes ? post.likes.length : 0)

    /* React hook for handling the state of the like on the post (whether user has liked or not) */
    const [liked, setLiked] = useState(post.likes ? post.likes.includes(user.username) : false)

    /* React hook for handling the style of the like button, currently set to the style of noLike within the CSS file */
    const [likeStyle, setStyle] = useState(liked ? "like" : "noLike");

    /* event handling for liking the post (clicking like button) */
    function toggleLike() {

        const body = {
            user: user,
            post_id: post.id
        }

        sendHTTPRequest("POST", "/posts/like", JSON.stringify(body), JSON.parse(at!))
            .then((responseData) => {
                const likes = (JSON.parse(responseData as unknown as string) as post).likes;

                setLiked(likes ? likes.includes(user.username) : false);
                setLikes(likes ? likes.length : 0);
                setStyle(likeStyle === "noLike" ? "like" : "noLike");
            })
            .catch((err) => console.log(err));

    }

    /* setting focus prop of comment field */
    const [focused, setFocused] = useState(false);

    /* react hook for changing the state of the modal */
    const [open, setOpen] = useState(false);

    /* comment component initialised */
    const commentSection = <Comment commentsList={post.comments} post_id={post.id} focused={focused} setFocused={(value: boolean) => setFocused(value)} />

    return (

        /* container which holds all components relevant to this Post component */
        <Container sx={{ marginTop: "5rem" }}>

            {/* Paper component for a post container */}
            <Paper className={`${postSize}Container`} data-testid="container-test">

                {/* Temporary image component, this will be pulled from backend when available  */}
                <img draggable={"false"} src={image.src} alt={"Error..."} />

                {/* Modal popup menu for the comment section component */}

                <Modal className={"commentModal"} open={open} onClose={() => setOpen(false)}>
                    <>{commentSection}</>
                </Modal>

                {/* divider for the comment section displayed within the main container, on the right (desktop ver) */}
                <div className={`${postSize}DesktopComment`}>
                    <>{commentSection}</>
                </div>

                {/* postHeader divider, holds all components related to the header of a post */}
                <div className={`${postSize}PostHeader`} data-testid="post-header-test">

                    {/* Grid container created to hold the components of this header, they will be aligned with each-other  */}
                    <Grid direction="row" alignItems="center" container wrap="nowrap" spacing={1.5}>

                        <Grid item>

                            {/* displays the avatar of the post author */}
                            {<Avatar onClick={() => navigate("/profile/" + post.author.profileID)} sx={{cursor: "pointer", fontSize: 30, width: 56, height: 56, bgcolor: ColorName(`${post.author.name} ${post.author.surname}`) }}>
                                {post.author.name.charAt(0)}{post.author.surname.charAt(0)}
                            </Avatar>}

                        </Grid>

                        <Grid item xs>

                            {/* authors username, displayed in bold text to emphasise */}
                            <p className={"postAuthor"}>{post.author.name} {post.author.surname}</p>

                            {/* line underneath the authors username to separate it from caption text */}
                            <hr />

                            {/* handles the post caption in the desktop view */}
                            <div className={'postCaptionDesktop'}>

                                {/* in the desktop view there has to be a limit on the amount of characters due to the limited size
                                 of the post container, this character limit is 15 characters as of now */}
                                <PostCaption captionText = {post.title} characterLimit = {15}/>

                            </div>

                            {/* handles the post caption in the mobile view */}
                            <div className={'postCaptionMobile'}>

                                {/* more text can be displayed in mobile view but it has a character limit of 50 */}
                                <PostCaption captionText = {post.title} characterLimit = {50}/>

                            </div>

                        </Grid>
                    </Grid>
                </div>

                {/* divider for handling desktop post interaction e.g. likes */}
                <div className={`${postSize}DesktopPostInteraction`}>

                    {/* Grid container used here to easily align these components horizontally */}
                    <Grid direction="row" alignItems="center" container wrap="nowrap">

                        {/* ERROR: follow cursor & transition component work but throwing some warnings */}
                        {/* Tooltip element to show the likes on the current post instead of them always showing, keeps the container compact */}
                        <Tooltip followCursor TransitionComponent={Zoom} title={likes}>

                            {/* button for the like component */}
                            <IconButton onClick={() => { toggleLike() }} className={likeStyle}>

                                {/* uses a smiley face showing where desktop users can like the post */}
                                <EmojiEmotionsIcon sx={{ fontSize: '1.875rem' }} />

                            </IconButton>

                        </Tooltip>

                        {/* button for the comment component, should focus on CommentField when clicked (works somewhat)  */}
                        <IconButton onClick={() => setFocused(!focused)} sx={{ margin: "auto" }}>

                            {/* uses a simple chat bubble icon depicting where desktop users can access comments */}
                            <ChatBubbleIcon className={'staticButtons'} />

                        </IconButton>

                        {/* button for the edit component, not implemented yet */}
                        <IconButton onClick={() => navigate("/canvas", { state: { room: generateRoomID(), size: post.size, image: svg } })}>
                            {/* uses a pencil icon depicting where desktop users can access the edit feature */}
                            <CreateIcon className={'staticButtons'} />
                        </IconButton>
                    </Grid>
                </div>

            </Paper>

            {/* divider for handling desktop post interaction e.g. likes */}
            <div className={"mobilePostInteraction"}>

                {/* Grid container used here to easily align these components horizontally */}
                <Grid direction="row" alignItems="center" container wrap="nowrap">

                    <Grid marginLeft="auto" marginRight="auto" item>

                        {/* button for the like component */}
                        <IconButton className={likeStyle} onClick={() => { toggleLike() }}>

                            {/* uses a smiley face showing where mobile users can like the post */}
                            <EmojiEmotionsIcon sx={{ fontSize: '3rem' }} />

                        </IconButton>

                        {/* button component which can be pressed to display the comment section in a Modal */}
                        <IconButton sx={{ marginLeft: '2em' }} onClick={() => setOpen(true)}>

                            {/* uses a simple chat bubble icon depicting where mobile users can access comments */}
                            <ChatBubbleIcon sx={{ fontSize: '3rem', color: "#42342c" }} />

                        </IconButton>

                        {/* like counter for when in mobile view, tooltip wont work since no cursor on mobile */}
                        <div style={{ marginLeft: '1.70em' }}>{likes}</div>

                    </Grid >
                </Grid >
            </div >
        </Container >
    )
}

export default Post;
