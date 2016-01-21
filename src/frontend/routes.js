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
import UserWeaponList from './containers/UserWeaponListContainer';
import Subscribe from './containers/SubscribeContainer';
import Cancel from './containers/CancelContainer';
import Module from './containers/ModuleContainer';
import ModuleList from './containers/ModuleListContainer';

import Welcome from '../components/Welcome';
import TermsOfService from '../components/TermsOfService';
import PrivacyPolicy from '../components/PrivacyPolicy';
import NotFound from '../components/NotFound';
import About from '../components/About';
import SimplePage from '../components/SimplePage';

export default function getRoutes() {
  return (
    <Route path="/">
      <Route path="app" component={ App }>
        <Route path="home" component={ Home } />
        <Route path="account" component={ Account } />
        <Route path="weapons" component={ Weapons } />
        <Route path="myweapons" component={ UserWeaponList } />
        <Route path="modules" component={ ModuleList } />
        <Route path="module/:id" component={ Module } />
        <Route path="subscribe" component={ Subscribe } />
        <Route path="cancel" component={ Cancel } />
        <Route path="about" component={ About } />
        <Route path="terms" component={ TermsOfService } />
        <Route path="privacy" component={ PrivacyPolicy } />
      </Route>
      // Routes that don't require authentication
      <Route path="" component={ SimplePage }>
        <Route path="register" component={ Register } />
        <Route path="login" component={ Login } />
        <Route path="about" component={ About } />
        <Route path="terms" component={ TermsOfService } />
        <Route path="privacy" component={ PrivacyPolicy } />
        <Route path="logout" component={ Logout } />
        <Route path="confirm" component={ Confirm } />
        <Route path="forgotpassword" component={ ForgotPassword } />
        <Route path="resetpassword" component={ ResetPassword } />
        <Route path="/*" component={ NotFound } />
      </Route>
      <IndexRoute component={ Welcome } />
    </Route>
    );
}
