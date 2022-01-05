import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Header from './Components/Header/Header';
import Comment from './Components/Comment/Comment';
import Post from './Components/Post/Post';


ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <Post user={{
                name: "",
                thumbnail: "",
                color: ""
      }} image={undefined} caption={""} likes={[]} comments={[]}/>
    <Comment text={ "This is a comment!" } user={ {name : "DrawDojo", thumbnail : "Thumbnail", color : "#fef3bd"} }/>

  </React.StrictMode>,
  document.getElementById('root')
);
