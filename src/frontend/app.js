import _ from 'lodash';
import log from 'loglevel'
import React from 'react'
import ReactDom from 'react-dom';
import { Router, Route, DefaultRoute, NotFoundRoute } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'

import App from '../components/App';
import Home from '../components/Home';

let history = createBrowserHistory();

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', run);
} else {
  window.attachEvent('onload', run);
}

function run() {
  var logLevel = log.levels.DEBUG;
  if (process.env.LOG_LEVEL) {
    logLevel = parseInt(process.env.LOG_LEVEL);
  }

  log.setLevel(logLevel);

  ReactDom.render(

    <Router history={history}><Route path='/' component={App}>
        <Route path='/home' component={Home}>
        </Route>
       </Route>
      </Router>, document.getElementById('content'));

}

