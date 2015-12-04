import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { login } from '../actions';

import Login from '../../components/Login';

class LoginContainer extends Component {
  render() {
    const {dispatch, session} = this.props;
    return <Login session={session} login={credentials => dispatch(login(credentials))} />
  }
}

function select(state) {
  return {
    session: state.app.session
  };
}


export default connect(select)(LoginContainer);
