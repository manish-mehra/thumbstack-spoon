import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import {
  BrowserRouter
} from "react-router-dom"

import { socket, SocketContext } from './context/socket'

ReactDOM.render(
  <SocketContext.Provider  value={socket}>
    <BrowserRouter>
      <App/>
    </BrowserRouter>
  </SocketContext.Provider>,
  document.getElementById('root')
);

