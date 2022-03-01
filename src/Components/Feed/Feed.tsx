import React, { useEffect, useState } from "react";
import './Feed.scss'
import { Button, CircularProgress, IconButton } from '@mui/material';
import smoothscroll from 'smoothscroll-polyfill';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';
import { post } from "../../Types/Post";
import { useNavigate } from "react-router-dom";
import { v1 } from "uuid";
import { getAccessToken } from "../../Util/handleResponse";
import Post from "../Post/Post";

const at = getAccessToken();

/* Lazily loads the Post component, currently has a 2 second loading time when opening the feed */
// const FeedPost = lazy(() => { return new Promise(resolve => setTimeout(resolve, 1000)).then(() => import("../Post/Post")) })

/* initialises the smoothscroll package, this is required for smooth scrolling on browsers such as Safari */
smoothscroll.polyfill();

function Feed() {
    const navigate = useNavigate();
    let [posts, setPosts] = useState<Array<post>>([]);
    const [index, setIndex] = useState(2);

    function fetchPosts() {
        const url = "http://localhost:8080/posts";
        const req = new XMLHttpRequest();
        // open async http post request
        req.open("GET", url, true);
        req.setRequestHeader("Content-Type", "application/json");
        req.setRequestHeader('Authorization', "Bearer " + JSON.parse(at));
        req.onreadystatechange = () => {
            if (req.readyState === 4 && req.status === 200) {
                //console.log(JSON.parse(req.response));
                if (req.response) {
                    setPosts(JSON.parse(req.response) as unknown as Array<post>);
                }
            }
        };
        req.send();
    }

    useEffect(() => {
        if (posts.length === 0) {
            fetchPosts();
        }
    }, [posts.length]);

    /* loadPost function which loads a post into the feed when called */
    function loadPost() {
        setIndex(index + 2);
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
                <div style={{ textAlign: 'center', height: 50 }}>

                    {/* simple button which will load more posts onto the feed when clicked */}
                    <Button className={'loadingButton'} onClick={loadPost}>LOAD</Button>

                </div>

            </div>

            {/* IconButton for the create functionality, this should generate a modal which allows for canvas options */}
            <IconButton size={"small"} className={'createButton'}
                data-testid="create-button-test" onClick={() => navigate('/canvas')}><GestureOutlinedIcon /></IconButton>

            {/* when showUpArrow is true then the button can be displayed & its functionality can be utilised */}
            {showUpArrow &&
                (<span>
                    <IconButton size={"small"} className={'scrollButton'} data-testid="scroll-button-test"
                        onClick={scrollToTop}><ArrowUpwardIcon /></IconButton>
                </span>)}

        </>

    )

}

export default Feed;
