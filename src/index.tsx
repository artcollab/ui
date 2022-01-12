import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Header from './Components/Header/Header';
import Login from './Components/Login/Login';

ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <Login/>

  </React.StrictMode>,
  document.getElementById('root')
);
