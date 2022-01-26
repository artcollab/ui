import React, {lazy, Suspense, useState} from "react";
import './Feed.scss'
import { feed } from "../../Types/Feed";
import { CircularProgress} from '@mui/material';

/* Lazily loads the Post component, currently has a 2 second loading time when opening the feed */
const FeedPost = lazy(() => {return new Promise(resolve => setTimeout(resolve, 2 * 1000)).then(() => import("../Post/Post"))})

function Feed(props : feed) {

    /* number of posts displayed, initially set to 2 posts on the page */
    let postsDisplayed = 2;

    /* React hook for the array of posts, used for generating and keeping track of how many posts are displayed */
    const [displayPosts, setDisplayPosts] = useState(Array.from(Array(postsDisplayed).keys()));

    /* loadPost function which loads a post into the feed when called */
    function loadPost() {

        /* pgBottom constant which holds the value associated with the bottom of the page */
        const pgBottom = document.documentElement.scrollHeight - document.documentElement.scrollTop <= document.documentElement.clientHeight;

        /* if the user has scrolled to the bottom of the feed then the body of this statement can be executed */
        if (pgBottom) {

            /* increases the amount of now displayed posts on the feed by 1 */
            postsDisplayed++;

            /* a new post is fetched & displayed onto the feed for the user */
            setDisplayPosts(Array.from(Array(postsDisplayed).keys()));
        }

        /* if the user scrolls slightly above the top of the page then the page will be reloaded, this acts as a refresh function */
        if(document.documentElement.scrollTop === -10) {

            /* reloads the current window */
            window.location.reload();
        }
    }

    /* with each scroll the loadPost function is called & checked to see if any of the if statements have became true */
    window.addEventListener("scroll", loadPost)

    return (

        /* divider for the feed of posts */
        <div>

            {/* Suspense tag, on fallback will display a loading circle icon to depict the loading of the feed component*/}
            <Suspense fallback={<div className={"test"}><CircularProgress size={125} sx={{color: "#ffccac"}} /></div>}>

                {/* uses a nested map to fetch and display the posts */}
                {displayPosts.map(() => props.posts?.map((post) => <FeedPost Post={post}/>))}

            </Suspense>
            
        </div>

    )
}

export default Feed;

