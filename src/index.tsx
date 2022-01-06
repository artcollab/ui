import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Header from './Components/Header/Header';
import Comment from './Components/Comment/Comment';
import Post from './Components/Post/Post';

ReactDOM.render(
  <React.StrictMode>
    <Header/>
    {/*<Feed />*/}
    <Post/>

  </React.StrictMode>,
  document.getElementById('root')
);
