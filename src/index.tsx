import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Header from './Components/Header/Header';
import { Paper } from '@mui/material';

ReactDOM.render(
  <React.StrictMode>
    <Header/>
    <Paper elevation={3} className="mainContainer"> 
    
    </Paper>
  </React.StrictMode>,
  document.getElementById('root')
);
