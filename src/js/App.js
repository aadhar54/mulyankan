import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Home from './layouts/Home';
import Help from './layouts/Help';

const App = () => {
  return (
    <BrowserRouter>
      <Route exact path="/" component={Home} />
      <Route path="/help" component={Help} />
    </BrowserRouter>
  );
};

export default App;
