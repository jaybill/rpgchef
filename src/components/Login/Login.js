import './Login.less';
import React, { Component, PropTypes } from 'react';
import { Input, Panel, Button, Grid, Row, Col, Alert } from 'react-bootstrap';
import log from 'loglevel';
import { connect } from 'react-redux'

export default class Login extends Component {

  constructor() {
    super()
    this._login = this._login.bind(this);
  }

  _login() {
    this.props.login({
      username: this.refs.username.getValue(),
      password: this.refs.password.getValue()
    });
  }

  handleKeyUp(e) {
    if (e.keyCode === 13) {
      this._login();
    }
  }

  render() {
    var loginError;
    var self = this;

    if (this.props && this.props.error) {
      var msg;
      switch (this.props.error) {
        case "Unconfirmed email":
          msg = "You have not confirmed your email yet.";
          break;
        case "Inactive account":
          msg = "Your account is no longer active.";
          break;
        case "bad credentials":
          msg = "Incorrect username or password.";
          break;
        default:
          msg = "Incorrect username or password.";
      }

      loginError = <Alert bsStyle='danger' key="Login-error" ref='error' className="Login-error">{msg}</Alert>;
    }

    return (
      <Grid className="Login">
                <Row>
                    <Col className="Login-wrapper" xs={6} md={4} xsOffset={3} mdOffset={4}>
                        <h1>Log in</h1>

        {loginError}

                        <form>
                            <Input ref="username" type='text' placeholder='Username' autoFocus={true} />
                            <Input ref="password" type='password' placeholder='Password' onKeyUp={this.handleKeyUp}/>
            <p><a href="/forgotpassword">Forgot password?</a></p>
                            <Button bsStyle='primary' onClick={this._login}>Sign in</Button>
                        </form>
                        
                    </Col>
                </Row>
            </Grid>
      );
  }
}

Login.propTypes = {
  login: PropTypes.func.isRequired
}
