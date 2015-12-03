import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { login } from '../actions';

import Login from '../../components/Login';

class LoginContainer extends Component {

  render() {
    const {dispatch} = this.props;
    return <Login login={credentials => dispatch(login(credentials))} />
  }


}

function select(state) {
  return state;
}


export default connect(select)(LoginContainer);
