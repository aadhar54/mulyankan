import React, { useState } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './layouts/Home';
import Help from './layouts/Help';
import Auth from './layouts/Auth';

const App = () => {
  const [mode, setMode] = useState('signin');

  const changeMode = newMode => {
    console.log(newMode);
    setMode(newMode);
  };

  return (
    <BrowserRouter>
      <Route exact path="/" render={() => <Home mode={mode} />} />
      <Route path="/help" render={() => <Help mode={mode} />} />
      <Route
        path="/auth"
        render={() => <Auth setMode={changeMode} mode={mode} />}
      />
      <ToastContainer autoClose={3000} position="bottom-left" />
    </BrowserRouter>
  );
};

export default App;
