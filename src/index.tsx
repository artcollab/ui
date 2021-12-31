import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Feed from './Components/Feed/Feed';
import Header from './Components/Header/Header';

ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <Feed />
  </React.StrictMode>,
  document.getElementById('root')
);
