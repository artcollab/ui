import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Header from './Components/Header/Header';
import Canvas from './Components/Canvas/Canvas';

ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <Canvas room={'exampleRoom'}/>
  </React.StrictMode>,
  document.getElementById('root')
);
