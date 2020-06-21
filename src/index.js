import React from 'react';
import ReactDOM from 'react-dom';
import App from './js/App';
import * as serviceWorker from './serviceWorker';

// STYLES
import './styles/index.css';
import './styles/ContextMenu.css';
import './styles/Menu.css';
import './styles/Navbar.css';
import './styles/Sidebar.css';
import './styles/Welcome.css';
import './styles/Help.css';
import './styles/Music.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
