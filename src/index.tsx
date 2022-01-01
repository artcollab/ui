import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Feed from './Components/Feed/Feed';
import Header from './Components/Header/Header';
import Comment from './Components/Comment/Comment';

ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <Feed />
    <Comment text={ " - This is a comment!" } user={ {name : "Cade", thumbnail : "Thumbnail"} } />
  </React.StrictMode>,
  document.getElementById('root')
);
