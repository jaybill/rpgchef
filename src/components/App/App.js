'use strict';

import './App.less';
import React from 'react';

import log from 'loglevel';

export default React.createClass({
  render() {

    return (
      <div className="App">
            {this.props.children}
            </div>
      );
  }

});
