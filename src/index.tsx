import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Header from './Components/Header/Header';
import Register from './Components/Register/Register';
import Feed from './Components/Feed/Feed';
        
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
    <Register/>
    <Feed posts={[tempPost]}/>
  </React.StrictMode>,
  document.getElementById('root')
);
