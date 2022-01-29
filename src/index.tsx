import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Header from './Components/Header/Header';
import Feed from './Components/Feed/Feed';
import {post} from "./Types/Post";
import Register from './Components/Register/Register';

const tempPost : post = {
    id: 0,
    user: {
        name: " ",
        thumbnail: " ",
        color: " ",
    },
    image: " ",
    caption: " ",
    likes: [],
    comments: [],
}

ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <Feed posts={[tempPost]}/>
    <Register />
  </React.StrictMode>,
  document.getElementById('root')
);
