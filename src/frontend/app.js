import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';

import reducers from './reducers';
import getRoutes from './routes';

// Redux DevTools store enhancers
import { devTools, persistState } from 'redux-devtools';
// React components for Redux DevTools
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';

const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer
}));

let createStoreWithMiddleware = applyMiddleware(promiseMiddleware)(createStore)
const finalCreateStore = __DEVTOOLS ? compose(
  // Provides support for DevTools:
  devTools(),
  // Lets you write ?debug_session=<name> in address bar to persist debug sessions
  persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
)(createStoreWithMiddleware) : createStoreWithMiddleware;

const store = finalCreateStore(reducer);
const history = createBrowserHistory();

syncReduxAndRouter(history, store);
function run() {
  ReactDOM.render(
    <div>
    <Provider store={store}>
      <Router history={history}>
        {getRoutes()}
      </Router>
    </Provider>
    { __DEVTOOLS &&
    <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor}/>
    </DebugPanel>
    }
  </div>,
    document.getElementById('root')
  );
}

// Run the application when both DOM is ready
// and page content is loaded
if (window.addEventListener) {
  window.addEventListener('DOMContentLoaded', run);
} else {
  window.attachEvent('onload', run);
}
