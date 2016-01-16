'use strict';

import './ForgotPassword.less';
import React, { Component } from 'react';
import { Grid, Row, Col, Input, Button, Alert } from 'react-bootstrap';
import log from 'loglevel';

export default class ForgotPassword extends Component {

  constructor() {
    super();
    this.sendReset = this.sendReset.bind(this);
  }

  sendReset() {
    const {onSubmit} = this.props;
    var username = this.refs.username.getValue();
    if (username) {
      onSubmit(username);
    }
  }

  render() {

    var errorDisplay;
    var formDisplay;
    const {complete, error} = this.props;

    if (complete && !error) {
      formDisplay = <Col md={ 6 }>
                      <Alert bsStyle="success">
                        <h4>Reset Instructions Sent</h4>
                        <p>Check your email to continue.</p>
                      </Alert>
                    </Col>;
    } else {
      if (error) {
        errorDisplay = <Alert bsStyle="danger">
                         { error }
                       </Alert>;
      }

      formDisplay = <Col md={ 6 }>
                      <h1>Forgot Password</h1>
                      { errorDisplay }
                      <p>Enter your username (usually your email) below and we will send you an email about how to change your password.</p>
                      <Input ref="username" type='text' placeholder='username (email address)' autoFocus={ true } />
                      <Button bsStyle='primary' onClick={ this.sendReset }>Send Reset Instructions</Button>
                    </Col>
    }

    return (
      <div className="ForgotPassword">
        <Grid>
          <Row>
            { formDisplay }
          </Row>
        </Grid>
      </div>

      );
  }

}

