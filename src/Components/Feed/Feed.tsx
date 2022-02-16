import React, {lazy, Suspense, useState} from "react";
import './Feed.scss'
import {Button, CircularProgress, IconButton, Switch, Container,
        Typography, Popover, Radio, RadioGroup, FormControlLabel,
        FormControl} from '@mui/material';
import smoothscroll from 'smoothscroll-polyfill';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CreateIcon from '@mui/icons-material/Create';
import {post} from "../../Types/Post";
import { useNavigate } from "react-router-dom";

/* Lazily loads the Post component, currently has a 2 second loading time when opening the feed */
const FeedPost = lazy(() => {return new Promise(resolve => setTimeout(resolve, 1000)).then(() => import("../Post/Post"))})

/* number of posts displayed, initially set to 2 posts on the page */
let postsDisplayed = 2;

/* initialises the smoothscroll package, this is required for smooth scrolling on browsers such as Safari */
smoothscroll.polyfill();

const tempPost : post = {
    id: 0,
    image: " ",
    caption: " ",
    likes: [],
    comments: [],
    user: {
        id: "",
        username: "",
        email: "",
        name: "",
        surname: "",
        password: "",
        following: undefined
    }
}

/* alphabet constant which includes alphabetical characters from a-z & A-Z */
const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

/* initial empty string for the roomID */
let roomID = '';

function Feed() {

    /* for react routing to other pages */
    const navigate = useNavigate();

    /* React hook for the array of posts, used for generating and keeping track of how many posts are displayed */
    const [displayPosts, setDisplayPosts] = useState(Array.from(Array(postsDisplayed).keys()))

    /* loadPost function which loads a post into the feed when called */
    function loadPost() {

        /* increases the amount of now displayed posts on the feed by 1 */
        postsDisplayed = postsDisplayed + 2;

        /* a new post is fetched & displayed onto the feed for the user */
        setDisplayPosts(Array.from(Array(postsDisplayed).keys()));
    }

    /* React hook for handling the canvas creation popover */
    const [popover, setPopover] = useState(false);

    /* opens the popover when the canvas creation button is clicked, each time this is called
    * a new randomly generated roomID will be created and displayed */
    function handlePopover() {

        /* button has been clicked so popover can be shown */
        setPopover(true);

        /* sets the roomID to empty string again to avoid a previously generated string appearing again */
        roomID = ''

        /* generates 6 random alphabetical characters [a-Z] as a string */
        while (roomID.length < 6) {
            roomID += alphabet[Math.floor(Math.random() * alphabet.length)]
        }
    }

    /* when the user clicks anywhere else on the screen outside of the popover this will be
    * called and will close the popover */
    function handlePopoverClose() {

        /* user has clicked somewhere else on-screen so popover can be hidden */
        setPopover(false);
    }

    /* React hook to handle when the up arrow is shown/hidden  */
    const [showUpArrow, setUpArrow] = useState(false);

    /* checks the current position of the Y axis in the window to determine whether to show the arrow or not */
    window.addEventListener("scroll", () => {

        /* if past this threshold then the arrow is displayed onscreen */
        if (window.scrollY >= 350) {
            setUpArrow(true)
        }

        /* otherwise it stays hidden */
        else {
            setUpArrow(false)
        }
    })

    /* when called this will scroll the window to the top of the page */
    function scrollToTop() {

        /* uses smooth scrolling behaviour instead of instantly transitioning to the top */
        window.scroll({top: 0, behavior: 'smooth'});
    }

    return (

        <>
            {/* divider for the feed of posts */}
            <div>

                {/* Suspense tag, on fallback will display a loading circle icon to depict the loading of the feed component*/}
                <Suspense
                    fallback={<div className={"loadingIcon"}><CircularProgress className={"loadingGraphic"} size={125}/>
                    </div>}>

                    {/* uses a nested map to fetch and display the posts */}
                    {displayPosts.map((i) => [tempPost].map((tempPost) => <FeedPost key={i} Post={tempPost}/>))}

                </Suspense>

                {/* div for the loading button, is centered & is offset from the post a little bit */}
                <div style={{textAlign: 'center', height: 50}}>

                    {/* simple button which will load more posts onto the feed when clicked */}
                    <Button className={'loadingButton'} onClick={loadPost}>LOAD</Button>

                </div>

            </div>

            {/* IconButton for the create functionality, on click this will show a popover which will provide canvas options */}
            <IconButton onClick={handlePopover} size={"small"} className={'createButton'} data-testid="create-button-test">
                <GestureOutlinedIcon/>
            </IconButton>


            {/* Popover component which allows for canvas customisation */}
            <Popover open={popover} onClose={handlePopoverClose}
                     anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                     style={{marginLeft: 40, textAlign: "center"}}
            >

                {/* container for the canvas options included in the popover menu */}
                <Container sx={{p: 1}}>

                    {/* canvas creation title*/}
                    <Typography className={"popoverTitle"}>Canvas Creation</Typography>

                    {/* roomID provided to user, a random alphabetical string of 6 characters */}
                    <Typography className={"popoverOptions"}>Room ID: {roomID}</Typography>

                    {/* form for the canvas size options */}
                    <FormControl className={"popoverOptions"}>

                        {/* section title */}
                        <Typography>Canvas Size: </Typography>

                        {/* radio group detailing each of the canvas options available to the user (square, portrait, rectangle) */}
                        <RadioGroup style={{marginTop: 10, marginLeft: 15}} row defaultValue="Square">
                            <FormControlLabel value="Square" control={<Radio />} label="Square" />
                            <FormControlLabel value="Portrait" control={<Radio />} label="Portrait" />
                            <FormControlLabel value="Rectangle" control={<Radio />} label="Rectangle" />
                        </RadioGroup>
                    </FormControl>

                    {/* private option switch, only host can invite people */}
                    <Typography className={"popoverOptions"}>Private: <Switch/></Typography>

                    {/* invitation option, includes clickable button which will be used to invite collaborators */}
                    <Typography className={"popoverOptions"}>Invite:
                        <IconButton style={{color: "#42342c"}} size={"small"}><PersonAddIcon/></IconButton>
                    </Typography>

                    {/* create canvas button which navigates the user to the canvas menu */}
                    <Button className={"createCanvas"} onClick={() => navigate("/canvas")}>CREATE &nbsp;
                        <CreateIcon/>
                    </Button>
                </Container>
            </Popover>

            {/* when showUpArrow is true then the button can be displayed & its functionality can be utilised */}
            {showUpArrow &&
            (<span>
                <IconButton size={"small"} className={'scrollButton'} data-testid="scroll-button-test"
                            onClick={scrollToTop}><ArrowUpwardIcon/></IconButton>
            </span>)}
        </>
    )

}

export default Feed;
