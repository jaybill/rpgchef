import './Account.less';
import React, { Component, PropTypes } from 'react';
import { Input, Button, Grid, Row, Col, Alert } from 'react-bootstrap';
import log from 'loglevel';
import { CtrldInputText } from '../ControlledField';

export default class Account extends Component {

  constructor() {
    super();
    this.onSubmit = this.onSubmit.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onFieldChange = this.onFieldChange.bind(this);
  }

  componentWillMount() {

    this.setState({
      username: this.props.user.username
    });
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      username: newProps.user.username
    });
  }

  onFieldChange(name, newValue) {
    const newState = {};
    newState[name] = newValue;
    this.setState(newState);
  }

  onSubmit() {
    this.props.onSubmit(this.state);
  }

  onKeyUp(e) {
    if (e.keyCode === 13) {
      this.onSubmit();
    }
  }

  render() {

    let displayMessage;

    const {message, succeeded, failed, working} = this.props;

    if (succeeded) {
      displayMessage = <Alert bsStyle="success">{message}</Alert>
    }

    if (failed) {
      displayMessage = <Alert bsStyle="danger">{message}</Alert>
    }

    return (<div className="Account">
        <Grid>
            <Row>
            <Col md={6} mdOffset={3}>
            <h2>Account</h2>

            {displayMessage}

            <div className="form-group">
            <label>Username</label>
            <CtrldInputText type="email"
      className="form-control"
      value={this.state.username}
      name="username"
      onFieldChange={this.onFieldChange}/>
            </div>            
            <Button onClick={this.onSubmit} bsStyle="primary" bsSize="large">Submit</Button>
            </Col>
            </Row>
        </Grid>
        </div>);
  }
}

Account.propTypes = {
  message: PropTypes.string,
  succeeded: PropTypes.bool,
  failed: PropTypes.bool,
  working: PropTypes.bool,
  onSubmit: PropTypes.func
}
