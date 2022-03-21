import React, { useEffect, useState } from "react";
import './Feed.scss'
import {
    Button, CircularProgress, IconButton, Switch, Container,
    Typography, Popover, Radio, RadioGroup, FormControlLabel,
    FormControl
} from '@mui/material';
import smoothscroll from 'smoothscroll-polyfill';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CreateIcon from '@mui/icons-material/Create';
import { post } from "../../Types/Post";
import { useNavigate } from "react-router-dom";
import { v1 } from "uuid";
import { getAccessToken } from "../../Util/handleResponse";
import Post from "../Post/Post";
import { sendHTTPRequest } from "../../Actions/SendHTTPRequest";

const at = getAccessToken();

/* initialises the smoothscroll package, this is required for smooth scrolling on browsers such as Safari */
smoothscroll.polyfill();

/* alphabet constant which includes alphabetical characters from a-z & A-Z */
const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

/* initial empty string for the roomID */
let roomID = '';

function Feed() {
    const [canvasSize, setCanvasSize] = useState("Square");

    /* for react routing to other pages */
    const navigate = useNavigate();
    let [posts, setPosts] = useState<Array<post>>([]);
    const [index, setIndex] = useState(2);

    useEffect(() => {
        if (posts.length === 0) {
            sendHTTPRequest("GET", "/posts", undefined, JSON.parse(at)).then((responseData) => { setPosts(JSON.parse(responseData as unknown as string)) });
        }
    }, [posts.length]);

    /* loadPost function which loads a post into the feed when called */
    function loadPost() {
        setIndex(index + 2);
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
        window.scroll({ top: 0, behavior: 'smooth' });
    }

    return (

        <>
            {/* divider for the feed of posts */}
            <div>

                {!posts.length && (
                    <div className={"loadingIcon"}>
                        <CircularProgress size={125} sx={{ color: "#ffccac" }} />
                    </div>
                )}

                {/* uses a nested map to fetch and display the posts */}
                {posts.length > 0 && posts.map((value, ind) => {
                    return (ind < index && (
                        <Post key={v1()} Post={value} />
                    ))
                })}

                {/* div for the loading button, is centered & is offset from the post a little bit */}
                <div style={{ marginTop: 80, textAlign: 'center', height: 50 }}>

                    {/* simple button which will load more posts onto the feed when clicked */}
                    <Button className={'loadingButton'} onClick={loadPost}>LOAD</Button>

                </div>

            </div>


            {/* Popover component which allows for canvas customisation */}
            <Popover open={popover} onClose={handlePopoverClose}
                     anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                     style={{ marginLeft: 40, textAlign: "center" }}
            >

                {/* container for the canvas options included in the popover menu */}
                <Container sx={{ p: 1 }}>

                    {/* canvas creation title*/}
                    <Typography className={"popoverTitle"}>Canvas Creation</Typography>

                    {/* roomID provided to user, a random alphabetical string of 6 characters */}
                    <Typography className={"popoverOptions"}>Room ID: {roomID}</Typography>

                    {/* form for the canvas size options */}
                    <FormControl className={"popoverOptions"}>

                        {/* section title */}
                        <Typography>Canvas Size: </Typography>

                        {/* radio group detailing each of the canvas options available to the user (square, portrait, rectangle) */}
                        <RadioGroup style={{ marginTop: 10, marginLeft: 15 }} row value={canvasSize}>
                            <FormControlLabel value="Square" onClick={() => setCanvasSize("Square")} control={<Radio />} label="Square" />
                            <FormControlLabel value="Portrait" onClick={() => setCanvasSize("Portrait")} control={<Radio />} label="Portrait" />
                            <FormControlLabel value="Rectangle" onClick={() => setCanvasSize("Rectangle")} control={<Radio />} label="Rectangle" />
                        </RadioGroup>
                    </FormControl>

                    {/* private option switch, only host can invite people */}
                    <Typography className={"popoverOptions"}>Private: <Switch /></Typography>

                    {/* invitation option, includes clickable button which will be used to invite collaborators */}
                    <Typography className={"popoverOptions"}>Invite:
                        <IconButton style={{ color: "#42342c" }} size={"small"}><PersonAddIcon /></IconButton>
                    </Typography>

                    {/* create canvas button which navigates the user to the canvas menu */}
                    <Button className={"createCanvas"} onClick={() => navigate("/canvas", { state: { room: roomID, size: canvasSize } })}>CREATE &nbsp;
                        <CreateIcon />
                    </Button>
                </Container>
            </Popover>

            {/* IconButton for the create functionality, on click this will show a popover which will provide canvas options */}
            <IconButton onClick={handlePopover} size={"small"} className={'createButton'} data-testid="create-button-test">
                <GestureOutlinedIcon />
            </IconButton>

            {/* when showUpArrow is true then the button can be displayed & its functionality can be utilised */}
            {showUpArrow &&
            (<span>
                    <IconButton size={"small"} className={'scrollButton'} data-testid="scroll-button-test"
                                onClick={scrollToTop}><ArrowUpwardIcon /></IconButton>
                </span>)
            }
        </>
    )

}

export default Feed;