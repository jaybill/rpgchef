import './Register.less';
import '../SimplePage';
import React from 'react';
import { Link } from 'react-router';
import { Panel, Alert, Input, Grid, Row, Col, Button } from 'react-bootstrap';
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
        errorDisplay.push(<Alert key={ i++ } bsStyle="danger">
                            { e }
                          </Alert>);
      });
    }
    var wh;

    if (complete) {
      wh = (<div>
              <h2>Confirm Your Email</h2>
              <Panel bsStyle="primary">
                <p>We&apos;ve sent an email to <strong>{ emailSentTo }</strong>.</p>
                <p>Click the link in the email to activate your account.</p>
              </Panel>
            </div>);
    } else {
      wh = (<div>
              <h2>Register</h2>
              <Grid>
                <Row className="no-gutter">
                  <Col md={ 6 } mdOffset={ 3 }>
                    <Panel bsStyle="primary">
                      { errorDisplay }
                      <Input type="email" ref="email" label="Email Address" placeholder="Enter email" />
                      <Input type="password" ref="pass1" label="Password" placeholder="Password" />
                      <Input type="password" ref="pass2" label="Password (Again)" placeholder="Password (again)" />
                      <p>By creating an account, you agree to the
                        <Link to="/terms">Terms</Link> and the
                        <Link to="/privacy">Privacy Policy</Link>.</p>
                      <Button onClick={ this._register } bsStyle="primary" bsSize="large">Create Account</Button>
                    </Panel>
                  </Col>
                </Row>
              </Grid>
            </div>
      );
    }
    return (<div className="Register">
              { wh }
            </div>);
  }
}
