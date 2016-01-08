import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import log from 'loglevel';

import reducers from './reducers';
import getRoutes from './routes';
import analytics from './analytics';


const reducer = combineReducers(Object.assign({}, reducers, {
  routing: routeReducer
}));

const finalCreateStore = compose(
  applyMiddleware(thunk),
  // To use this, get  "Redux DevTools": 
  // https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

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
