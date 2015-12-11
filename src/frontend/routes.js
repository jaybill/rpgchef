import React from 'react';
import { Route } from 'react-router';

import App from './containers/AppContainer';
import Home from './containers/HomeContainer';
import Login from './containers/LoginContainer';
import Logout from './containers/LogoutContainer';
import Register from './containers/RegisterContainer';
import Confirm from './containers/ConfirmContainer';
import ForgotPassword from './containers/ForgotPasswordContainer';

export default function getRoutes() {
  return (
    <Route path="root">
    <Route path="/" component={App}>
      <Route path="home" component={Home}/>
      <Route path="login" component={Login}/>
      <Route path="register" component={Register}/>
    </Route>
   // Doing this here instead of inside of the App route to avoid promise problems.
   <Route path="/logout" component={Logout}/>
   <Route path="/confirm" component={Confirm}/>
   <Route path="/forgotpassword" component={ForgotPassword}/>
   </Route>
    );
}
