'use strict';

import './NotFound.less';
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Alert } from 'react-bootstrap';
import SimplePage from '../SimplePage'
export default class Welcome extends Component {

  render() {
    return (
      <SimplePage>
        <div className="NotFound">
          <Alert bsStyle="danger">
            <h4>There is not that.</h4>
            <p>You have requested a page that doesn&apos;t exist.</p>
          </Alert>
        </div>
      </SimplePage>
      );
  }

}

