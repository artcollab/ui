import React, { useEffect, useState } from "react";
import './Feed.scss'
import {
    Button, CircularProgress, IconButton, Switch, Container,
    Typography, Popover, Radio, RadioGroup, FormControlLabel,
    FormControl,
    Card,
    FormLabel,
    FormGroup,
    Checkbox
} from '@mui/material';
import smoothscroll from 'smoothscroll-polyfill';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import CreateIcon from '@mui/icons-material/Create';
import { post } from "../../Types/Post";
import { useNavigate } from "react-router-dom";
import { v1 } from "uuid";
import { getAccessToken, getUserAsObject } from "../../Util/handleResponse";
import Post from "../Post/Post";
import { sendHTTPRequest } from "../../Actions/SendHTTPRequest";
import { user } from "../../Types/User";
import { generateRoomID } from "../../Util/generateRoomID";

const at = getAccessToken();
const User = getUserAsObject();

/* initialises the smoothscroll package, this is required for smooth scrolling on browsers such as Safari */
smoothscroll.polyfill();

function Feed() {
    const [canvasSize, setCanvasSize] = useState("Square");

    /* for react routing to other pages */
    const navigate = useNavigate();
  
    if(at === `{"test":true}` || !User) navigate("/login");

    let [posts, setPosts] = useState<Array<post>>([]);
    const [index, setIndex] = useState(2);
    const [roomID] = useState(generateRoomID());

    const [users, setUsers] = useState<Array<string>>([]);

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

        sendHTTPRequest("GET", "/users", undefined, JSON.parse(at)).then((responseData) => {
            const userArr = (JSON.parse(responseData as unknown as string) as Array<user>).map((user) => user.username);
            const index = userArr.findIndex((ele) => {return ele === User.username});
            if(index > -1){
                userArr.splice(index, 1);
            }

            setUsers(userArr);
        })

        /* button has been clicked so popover can be shown */
        setPopover(true);

    }


    /* when the user clicks anywhere else on the screen outside of the popover this will be
    * called and will close the popover */
    function handlePopoverClose() {
        /* user has clicked somewhere else on-screen so popover can be hidden */
        setPopover(false);
    }

    /* when called this will scroll the window to the top of the page */
    function scrollToTop() {
        /* uses smooth scrolling behaviour instead of instantly transitioning to the top */
        window.scroll({ top: 0, behavior: 'smooth' });
    }

    const [usersSelected, setUsersSelected] = useState<Array<string>>([]);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.checked) {
            setUsersSelected([...usersSelected, event.target.name]);
        }
        else {
            const arr = [...usersSelected];
            const index = arr.findIndex((ele) => { return ele === event.target.name });
            arr.splice(index, 1);
            setUsersSelected(arr);
        }
    };

    function handleCanvas() {
        usersSelected.map((user) => {
            const body = {
                to: user,
                from: User.username,
                size: canvasSize,
                roomID: roomID
            }
            
            return sendHTTPRequest("POST", "/users/canvas/request", JSON.stringify(body), JSON.parse(at)).catch((err) => console.log(err));
        })

        navigate("/canvas", { state: { room: roomID, size: canvasSize } });
    }

    const userList = (
        <Container sx={{ height: "5rem" }}>
            <Card sx={{ height: "100%", width: "10rem", overflowY: "auto", m: "auto" }} variant="outlined">
                <FormControl sx={{ marginTop: "1rem", marginLeft: "1rem" }} component="fieldset" variant="standard">
                    <FormLabel component="legend">Add Users</FormLabel>
                    <FormGroup>
                        {users.map((user) => {
                            return (
                                <FormControlLabel
                                    key={v1()}
                                    control={
                                        <Checkbox checked={usersSelected.includes(user)} onChange={handleChange} name={user} />
                                    }
                                    label={user}
                                />
                            )
                        })}
                    </FormGroup>
                </FormControl>
            </Card>
        </Container>
    );

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
                    <Typography className={"popoverOptions"}>Invite:</Typography>
                    {userList}

                    {/* create canvas button which navigates the user to the canvas menu */}
                    <Button className={"createCanvas"} onClick={() => handleCanvas()}>CREATE &nbsp;
                        <CreateIcon />
                    </Button>
                </Container>
            </Popover>

            {/* IconButton for the create functionality, on click this will show a popover which will provide canvas options */}
            <IconButton onClick={handlePopover} size={"small"} className={'createButton'} data-testid="create-button-test">
                <GestureOutlinedIcon />
            </IconButton>

            {/* scroll to top button */}
            <span>
                    <IconButton size={"small"} className={'scrollButton'} data-testid="scroll-button-test"
                                onClick={scrollToTop}><ArrowUpwardIcon /></IconButton>
            </span>

        </>
    )

}

export default Feed;