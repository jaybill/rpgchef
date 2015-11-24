import _ from 'lodash';
import log from 'loglevel'
import React from 'react'
import ReactDom from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { reduxReactRouter, routerStateReducer, ReduxRouter } from 'redux-router';

import AppRouter from '../components/AppRouter';

let history = createBrowserHistory();

if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', run);
} else {
  window.attachEvent('onload', run);
}

function run() {
  var logLevel = log.levels.DEBUG;

  const reducer = combineReducers({
    router: routerStateReducer
  });

  if (process.env.LOG_LEVEL) {
    logLevel = parseInt(process.env.LOG_LEVEL);
  }

  log.setLevel(logLevel);

  ReactDom.render(<AppRouter history={history}/>, document.getElementById('content'));

}

