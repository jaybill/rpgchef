import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/AppContainer';
import Home from './containers/HomeContainer';
import Login from './containers/LoginContainer';
import Logout from './containers/LogoutContainer';
import Register from './containers/RegisterContainer';
import Confirm from './containers/ConfirmContainer';
import ForgotPassword from './containers/ForgotPasswordContainer';
import ResetPassword from './containers/ResetPasswordContainer';
import Account from './containers/AccountContainer';
import Weapons from './containers/WeaponsContainer';

import Welcome from '../components/Welcome';
import NotFound from '../components/NotFound';

export default function getRoutes() {
  return (
    <Route path="/">
    <Route path="app" component={App}>
      <Route path="home" component={Home}/>
      <Route path="account" component={Account}/>
      <Route path="weapons" component={Weapons}/>
    </Route>
   // Routes that don't require authentication
   <Route path="register" component={Register}/>
   <Route path="login" component={Login}/>
   <Route path="logout" component={Logout}/>
   <Route path="confirm" component={Confirm}/>
   <Route path="forgotpassword" component={ForgotPassword}/>
   <Route path="resetpassword" component={ResetPassword}/>
   <Route path="/*" component={NotFound}/>
   <IndexRoute component={Welcome}/>
   </Route>
    );
}
