'use strict';

import './Logout.less';
import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

import log from 'loglevel';

class Logout extends Component {


  render() {

    return (
      <div className="Logout">
            <Alert bsStyle="success" >You are now logged out.</Alert>

            </div>
      );
  }

}

export default Logout;
