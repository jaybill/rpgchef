import React from 'react';
import { Router, Route, DefaultRoute, NotFoundRoute } from 'react-router';
import App from './components/App';
import Home from './components/Home';

export default (
<Router><Route name='app' path='/' handler={App}>
        <Route name='home' path='/home' handler={Home}>
        </Route>
</Route>
</Router>
);
