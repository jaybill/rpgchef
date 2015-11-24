'use strict';

import App from '../App';
import Home from '../Home';
import Login from '../Login';
import { Router, Route, DefaultRoute, NotFoundRoute } from 'react-router';

export default const Routes =
      <Router history={this.props.history}><Route path='/' component={App}>
        <Route path='/home' component={Home}/>
        <Route path='/login' component={Login}/>
       </Route>
      </Router>


