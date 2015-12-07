import React from 'react';
import { Route } from 'react-router';

import App from './containers/AppContainer';
import Home from './containers/HomeContainer';
import Login from './containers/LoginContainer';


export default function getRoutes() {
  return (
    <Route path="/" component={App}>
      <Route path="home" component={Home}/>
      <Route path="login" component={Login}/>
    </Route>
    );
}
