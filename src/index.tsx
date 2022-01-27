import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Header from './Components/Header/Header';
import Login from './Components/Login/Login';
import Post from './Components/Post/Post';
import {post} from "./Types/Post";

const tempPost : post = {
    user: {
        name: " ",
        thumbnail: " ",
        color: " ",
    },
    image: " ",
    caption: " ",
    likes: [],
    comments: []
}

ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <Login/>
    <Post Post={tempPost}/>

  </React.StrictMode>,
  document.getElementById('root')
);
