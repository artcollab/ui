import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Header from './Components/Header/Header';
import Register from './Components/Register/Register';
        
ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <Register />
  </React.StrictMode>,
  document.getElementById('root')
);
