import React, {lazy, Suspense, useState} from "react";
import './Feed.scss'
import { feed } from "../../Types/Feed";
import {Button, CircularProgress, IconButton} from '@mui/material';
import smoothscroll from 'smoothscroll-polyfill';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import GestureOutlinedIcon from '@mui/icons-material/GestureOutlined';

/* Lazily loads the Post component, currently has a 2 second loading time when opening the feed */
const FeedPost = lazy(() => {return new Promise(resolve => setTimeout(resolve, 1000)).then(() => import("../Post/Post"))})

/* number of posts displayed, initially set to 2 posts on the page */
let postsDisplayed = 2;

/* initialises the smoothscroll package, this is required for smooth scrolling on browsers such as Safari */
smoothscroll.polyfill();

function Feed(props : feed) {

    /* React hook for the array of posts, used for generating and keeping track of how many posts are displayed */
    const [displayPosts, setDisplayPosts] = useState(Array.from(Array(postsDisplayed).keys()))

    /* loadPost function which loads a post into the feed when called */
    function loadPost() {

        /* increases the amount of now displayed posts on the feed by 1 */
        postsDisplayed = postsDisplayed + 2;

        /* a new post is fetched & displayed onto the feed for the user */
        setDisplayPosts(Array.from(Array(postsDisplayed).keys()));

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

                {/* Suspense tag, on fallback will display a loading circle icon to depict the loading of the feed component*/}
                <Suspense fallback={<div className={"loadingIcon"}><CircularProgress size={125} sx={{color: "#ffccac"}}/></div>}>

                    {/* uses a nested map to fetch and display the posts */}
                    {displayPosts.map((i) => props.posts?.map((post) => <FeedPost key={i} Post={post}/>))}

                </Suspense>

                {/* div for the loading button, is centered & is offset from the post a little bit */}
                <div style={{textAlign: 'center', height: 50}}>

                    {/* simple button which will load more posts onto the feed when clicked */}
                    <Button className={'loadingButton'} onClick={loadPost}>LOAD</Button>

                </div>

            </div>

            {/* IconButton for the create functionality, this should generate a modal which allows for canvas options */}
            <IconButton size={"small"} className={'createButton'} data-testid="create-button-test"><GestureOutlinedIcon/></IconButton>

            {/* when showUpArrow is true then the button can be displayed & its functionality can be utilised */}
            {showUpArrow &&
            (<span>
                <IconButton size={"small"} className={'scrollButton'} data-testid="scroll-button-test" onClick={scrollToTop}><ArrowUpwardIcon/></IconButton>
            </span>)}

        </>

export default Feed;