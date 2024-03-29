import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Header from './Components/Header/Header';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Register from './Components/Register/Register';
import Error from './Pages/Error';
import Home from './Pages/Home';
import Login from './Components/Login/Login';
import Canvas from './Components/Canvas/Canvas';
import Feed from './Components/Feed/Feed';
import Search from './Components/Search/Search';
import Profile from './Components/Profile/Profile';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Header />
        <Routes>
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/profile/:profileID" element={<Profile/>}/>
          <Route path="/feed" element={<Feed />}/>
          <Route path="/canvas" element={<Canvas/>}/>
          <Route path="/search" element={<Search/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="*" element={<Error/>} />
        </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
