import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Header from './Components/Header/Header';
import Feed from './Components/Feed/Feed';
import Comment from './Components/Comment/Comment';
import Post from './Components/Post/Post';


ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <Feed />
    <Comment text={ "This is a comment!" } user={ {name : "DrawDojo", thumbnail : "Thumbnail", color : "#fef3bd"} } />
    <Post user={{
            name: "",
            thumbnail: "",
            color: ""
        }} image={undefined} caption={""} likes={[]} comments={[]} />
  </React.StrictMode>,
  document.getElementById('root')
);
