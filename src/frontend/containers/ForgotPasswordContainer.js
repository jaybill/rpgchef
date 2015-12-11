import React, { Component } from 'react';
import log from 'loglevel';
import { connect } from 'react-redux'
import { forgotPassword as doForgotPassword } from '../actions';

import ForgotPassword from '../../components/ForgotPassword';
import SimplePage from '../../components/SimplePage';

class ForgotPasswordContainer extends Component {

  render() {

    log.debug(this.props);
    const {dispatch, forgotPassword} = this.props;

    return (<SimplePage><ForgotPassword
      onSubmit={username => dispatch(doForgotPassword(username))}
      error={forgotPassword.error}
      sending={forgotPassword.sending}
      complete={forgotPassword.complete}
      /></SimplePage>);
  }
}

function select(state) {

  return {
    forgotPassword: state.app.forgotPassword
  };
}


export default connect(select)(ForgotPasswordContainer);
