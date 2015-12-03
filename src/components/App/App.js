'use strict';

import './App.less';
import React, { Component } from 'react';

import log from 'loglevel';

class App extends Component {


  render() {

    return (
      <div className="App">
            {this.props.children}
            </div>
      );
  }

}

export default App;
