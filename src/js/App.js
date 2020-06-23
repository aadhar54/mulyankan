import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './layouts/Home';
import Help from './layouts/Help';
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route path="/help" component={Help} />
      <ToastContainer autoClose={5000} position="bottom-left" />
    </BrowserRouter>
  );
};

export default App;
