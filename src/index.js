import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

// STYLES
import './styles/index.css';
import './styles/ContextMenu.css';
import './styles/Menu.css';
import './styles/Navbar.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
