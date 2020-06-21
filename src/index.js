import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';
import * as serviceWorker from './serviceWorker';
import firebase from 'firebase/app';

// STYLES
import './styles/index.css';
import './styles/ContextMenu.css';
import './styles/Menu.css';
import './styles/Navbar.css';
import './styles/Sidebar.css';
import './styles/Welcome.css';
import './styles/Help.css';
import './styles/Music.css';

const firebaseConfig = {
  apiKey: 'AIzaSyCVmoFHsKitugdpAC_-_5cSagm2A-U33WM',
  authDomain: 'mulyankan-58611.firebaseapp.com',
  databaseURL: 'https://mulyankan-58611.firebaseio.com',
  projectId: 'mulyankan-58611',
  storageBucket: 'mulyankan-58611.appspot.com',
  messagingSenderId: '1020776798090',
  appId: '1:1020776798090:web:b7ca45e8bd6719b9e01a73',
  measurementId: 'G-TG3L97WYT9'
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
