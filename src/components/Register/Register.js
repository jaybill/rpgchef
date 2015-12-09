import './Register.less'

import React from 'react';
import { Alert, Input, Grid, Row, Col, Button } from 'react-bootstrap';
import _ from 'lodash';
import log from 'loglevel';

export default class Register extends React.Component {

  constructor() {
    super();
    this._register = this._register.bind(this);
  }

  _register() {


    this.props.onRegister({
      username: this.refs.email.getValue(),
      pass1: this.refs.pass1.getValue(),
      pass2: this.refs.pass2.getValue()
    });

  }

  render() {

    var errorDisplay;
    const {errors, registering, complete, emailSentTo} = this.props;

    if (!registering && (errors && errors.length)) {
      errorDisplay = [];
      var i = 0;
      _.forEach(errors, (e) => {
        errorDisplay.push(<Alert key={i++} bsStyle="danger">{e}</Alert>);
      });
    }
    var wh;

    if (complete) {
      wh = (<Grid><Row><Col md={6}><h2>Confirm Your Email</h2>
            <p>We&apos;ve sent an email to <strong>{emailSentTo}</strong>.</p>
            <p>Click the link in the email to activate your account.</p>
        </Col></Row></Grid>);
    } else {
      wh = (
        <Grid>
            <Row>
            <Col md={6} mdOffset={3}>
            <h2>Register</h2>
            {errorDisplay}


            <Input type="email" ref="email" label="Email Address" placeholder="Enter email" />

            <Input type="password" ref="pass1" label="Password" placeholder="Password" />

            <Input type="password" ref="pass2" label="Password (Again)" placeholder="Password (again)" />

            <Button onClick={this._register} bsStyle="primary" bsSize="large">Register</Button>

            </Col>
            </Row>
        </Grid>


      );
    }
    return (<div className="Register">{wh}</div>);
  }
}
