import './ResetPassword.less';
import React, { Component, PropTypes } from 'react';
import { Input, Panel, Button, Grid, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router';
import log from 'loglevel';
import { connect } from 'react-redux'
import _ from 'lodash';


export default class ResetPassword extends Component {

  constructor() {
    super();
    this.onReset = this.onReset.bind(this);
  }

  onReset() {
    this.props.onReset({
      pass1: this.refs.pass1.getValue(),
      pass2: this.refs.pass2.getValue()
    });
  }

  render() {

    var errorDisplay;
    const {error, verified, reset, resetError} = this.props;

    if (!verified) {
      return <Alert bsStyle="danger">Verification Failed.</Alert>
    }
    var wh;

    if (resetError) {
      errorDisplay = <Alert bsStyle="danger">
                       { resetError }
                     </Alert>
    }

    if (reset) {
      wh = (<Alert bsStyle="success">
              <h4>Password Reset Successful</h4>
              <p>You can now
                <Link to="/login">log in</Link> with your new password.</p>
            </Alert>);
    } else {
      wh = (
        <Grid>
          <Row>
            <Col md={ 6 } mdOffset={ 3 }>
              <h2>Reset Password</h2>
              { errorDisplay }
              <Input type="password" ref="pass1" autoComplete="off" label="Password" placeholder="Password" />
              <Input type="password" ref="pass2" autoComplete="off" label="Password (Again)" placeholder="Password (again)" />
              <Button onClick={ this.onReset } bsStyle="primary" bsSize="large">Reset Password</Button>
            </Col>
          </Row>
        </Grid>


      );
    }
    return (<div className="ResetPassword">
              { wh }
            </div>);
  }
}
