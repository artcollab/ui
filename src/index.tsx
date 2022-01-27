import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Header from './Components/Header/Header';
import Canvas from './Components/Canvas/Canvas';
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
    <Canvas room={'exampleRoom'}/>
    <Post Post={tempPost}/>

  </React.StrictMode>,
  document.getElementById('root')
);
