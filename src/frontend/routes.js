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

import Welcome from '../components/Welcome';
import NotFound from '../components/NotFound';

export default function getRoutes() {
  return (
    <Route path="root">
    <Route path="/" component={App}>
      <Route path="home" component={Home}/>
      <Route path="login" component={Login}/>
      <Route path="register" component={Register}/>
      <IndexRoute component={Welcome}/>
    </Route>
   // Doing this here instead of inside of the App route to avoid promise problems.
   <Route path="/logout" component={Logout}/>
   <Route path="/confirm" component={Confirm}/>
   <Route path="/forgotpassword" component={ForgotPassword}/>
   <Route path="/resetpassword" component={ResetPassword}/>
   <Route path="/*" component={NotFound}/>
   </Route>
    );
}
