import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Home from './layouts/Home';
import Help from './layouts/Help';
import Auth from './layouts/Auth';

const App = () => {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route path="/help" component={Help} />
      <Route path="/auth" component={Auth} />
      <ToastContainer autoClose={3000} position="bottom-left" />
    </BrowserRouter>
  );
};

export default App;
